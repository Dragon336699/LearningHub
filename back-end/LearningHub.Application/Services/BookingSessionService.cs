using AutoMapper;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.BookingSession;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Application.Mappers;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Application.Services
{
    public class BookingSessionService: IBookingSessionService
    {
        private readonly IBookingSessionRepository _bookingSessionRepository;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;

        public BookingSessionService(IBookingSessionRepository bookingSessionRepository, 
            IUnitOfWork unitOfWork, 
            IUserRepository userRepository, 
            RoleManager<Role> roleManager, 
            UserManager<User> userManager, 
            INotificationService notificationService
            )
        {
            _bookingSessionRepository = bookingSessionRepository;
            _unitOfWork = unitOfWork;
            _roleManager = roleManager;
            _userManager = userManager;
            _notificationService = notificationService;
        }

        public async Task<Result<string>> CreateBookingSessionAsync(CreateBookingSessionRequest request)
        {
            //(juki) i have to get user and match roleId manually instead of eager loading because someone forgot to define custom identity userrole when initing backend
            List<Role> roles = await _roleManager.Roles.ToListAsync();
            User? mentor = await _userManager.FindByIdAsync(request.MentorId.ToString());

            if (mentor == null) { 
                return Result<string>.Failure("Mentor not found");
            }
            bool isMentor = await _userManager.IsInRoleAsync(mentor, "Mentor");

            if (!isMentor)
            {
                return Result<string>.Failure("Mentor is invalid");
            }

            User? trainee = await _userManager.FindByIdAsync(request.TraineeId.ToString());
            if(trainee == null)
            {
                return Result<string>.Failure("Trainee not found");
            }

            bool isTrainee = await _userManager.IsInRoleAsync(trainee, "Trainee");

            if (!isMentor)
            {
                return Result<string>.Failure("Trainee is invalid");
            }

            bool isTraineeBusy = await _bookingSessionRepository.IsTraineeBusyAsync(request.TraineeId, request.StartTime, request.EndTime);

            if (isTraineeBusy)
            {
                return Result<string>.Failure("You are having another session in this time.");
            }

            var newSession = new BookingSession
            {
                Id = Guid.NewGuid(),
                MentorId = request.MentorId,
                TraineeId = request.TraineeId,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                SessionType = request.SessionType,
                Topic= request.Topic,
                Status = SessionStatus.Pending
            };

            await _bookingSessionRepository.AddAsync(newSession);
            await _unitOfWork.CompleteAsync();

            await SendNotificationEmailToMentorAsync(mentor.Email, newSession);

            return Result<string>.Success("Booking session created successfully and waiting for mentor's approval.");
        }

        public async Task<Result<string>> ApproveSessionAsync(Guid sessionId)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                BookingSession? currentSession = await _unitOfWork.BookingSessions
                    .FirstOrDefaultAsync(s => s.Id == sessionId && s.Status == SessionStatus.Pending);

                if (currentSession == null)
                {
                    await _unitOfWork.RollbackTransactionAsync(); 
                    return Result<string>.Failure("Session not found or already processed.");
                }

                User? trainee = await _unitOfWork.Users.GetByIdAsync(currentSession.TraineeId);
                if (trainee == null)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return Result<string>.Failure("Trainee not found");
                }

                bool isMentorBusy = await _unitOfWork.BookingSessions
                    .IsMentorBusyAsync(currentSession.MentorId, currentSession.StartTime, currentSession.EndTime);

                if (isMentorBusy)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return Result<string>.Failure("Cannot approve this session because the mentor has another confirmed session at the same time.");
                }

                currentSession.Status = SessionStatus.Approved;
                _unitOfWork.BookingSessions.Update(currentSession);

                await _unitOfWork.CommitTransactionAsync();

                await SendNotificationEmailToTraineeAsync(trainee.Email, currentSession);

                return Result<string>.Success("Session approved successfully.");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();

                return Result<string>.Failure($"An error occurred while approving the session: {ex.Message}");
            }
        }

        public async Task<Result<string>> CancelSessionAsync(Guid sessionId)
        {
            BookingSession? currentSession = await _bookingSessionRepository
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.Status == SessionStatus.Pending);
            if (currentSession == null)
            {
                return Result<string>.Failure("Session not found or already processed.");
            }
            currentSession.Status = SessionStatus.Cancelled;
            _bookingSessionRepository.Update(currentSession);
            await _unitOfWork.CompleteAsync();
            return Result<string>.Success("Session Cancelled successfully.");
        }

        public async Task<Result<List<AvailableSlotsResponse>>> GetAvailableSlotsAsync(AvailableSlotsRequest request)
        {
            DateTime targetDate = request.Date.Date;
            DateTime nextDay = targetDate.AddDays(1);

            DateTime currentTime = DateTime.Now;

            int durationMinutes = request.DurationType switch
            {
                SessionDurationType.Minutes30 => 30,
                SessionDurationType.Minutes45 => 45,
                SessionDurationType.Hour1 => 60,
                SessionDurationType.Hour1AndHalf => 90,
                SessionDurationType.Hours2 => 120,
                _ => 60
            };

            var baseAvailabilities = new List<(DateTime Start, DateTime End)>
        {
            (targetDate, nextDay)
        };

            var busySlots = await _bookingSessionRepository.GetBusySlotsAsync(request.MentorId, targetDate, nextDay);

            var rawFreeIntervals = GetRawFreeIntervals(baseAvailabilities, busySlots);

            var availableSlots = new List<AvailableSlotsResponse>();

            foreach (var interval in rawFreeIntervals)
            {
                var slotStart = interval.Start;

                while (slotStart.AddMinutes(durationMinutes) <= interval.End)
                {
                    var slotEnd = slotStart.AddMinutes(durationMinutes);

                    if (slotStart > currentTime)
                    {
                        availableSlots.Add(new AvailableSlotsResponse
                        {
                            StartTime = slotStart,
                            EndTime = slotEnd
                        });
                    }

                    slotStart = slotEnd;
                }
            }

            return Result<List<AvailableSlotsResponse>>.Success(availableSlots);
        }

        public async Task<Result<List<BookingSessionResponse>>> GetBookingSessions(GetSessionsRequest request)
        {
            List<BookingSession> bookingSessions= await _bookingSessionRepository.GetSessionsByUserAndDateAsync(request.UserId, request.Date);
            List<BookingSessionResponse> responses = BookingSessionMappingProfile.ToResponseList(bookingSessions);
            return Result<List<BookingSessionResponse>>.Success(responses);

        } 

        private List<(DateTime Start, DateTime End)> GetRawFreeIntervals(
            List<(DateTime Start, DateTime End)> baseAvailabilities,
            List<BookingSession> busySlots)
        {
            var freeIntervals = new List<(DateTime Start, DateTime End)>();

            foreach (var baseSlot in baseAvailabilities)
            {
                var currentStart = baseSlot.Start;

                var intersectingBusySlots = busySlots
                    .Where(b => b.StartTime < baseSlot.End && b.EndTime > baseSlot.Start)
                    .OrderBy(b => b.StartTime);

                foreach (var busy in intersectingBusySlots)
                {
                    if (busy.StartTime > currentStart)
                    {
                        freeIntervals.Add((currentStart, busy.StartTime));
                    }
                    currentStart = busy.EndTime > currentStart ? busy.EndTime : currentStart;
                }

                if (currentStart < baseSlot.End)
                {
                    freeIntervals.Add((currentStart, baseSlot.End));
                }
            }

            return freeIntervals;
        }

        private async Task SendNotificationEmailToMentorAsync(string mentorEmail, BookingSession session)
        {
            string timeRange = $"{session.StartTime:HH:mm} - {session.EndTime:HH:mm}";
            string dateStr = $"{session.StartTime:MM/dd/yyyy}";
            string emailBody = $@"
                <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                    <h3 style='color: #2b6cb0; margin-top: 0;'>🔔 Notification: New Session Booking Request</h3>
                    <p>Dear Mentor,</p>
                    <p>A trainee has submitted a new session booking request that is currently awaiting your review:</p>
            
                    <div style='background-color: #edf2f7; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 14px;'>
                        <p style='margin: 4px 0;'><strong>Date:</strong> {dateStr}</p>
                        <p style='margin: 4px 0;'><strong>Time:</strong> {timeRange}</p>
                    </div>

                    <p>Please log in to the website and navigate to your <strong>Session Management</strong> page to review and process this request.</p>
            
                    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                    <p style='font-size: 11px; color: #a0aec0; text-align: center; margin: 0;'>This is an automated notification. Please do not reply directly to this email.</p>
                </div>";

            await _notificationService.SendMessageAsync(mentorEmail, "New Session Booking Request", emailBody);
        }

        private async Task SendNotificationEmailToTraineeAsync(string traineeEmail, BookingSession session)
        {
            string timeRange = $"{session.StartTime:HH:mm} - {session.EndTime:HH:mm}";
            string dateStr = $"{session.StartTime:MM/dd/yyyy}";
            string emailBody = $@"
                <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                    <h3 style='color: #2b6cb0; margin-top: 0;'>✅ Session Booking Approved</h3>
                    <p>Dear Trainee,</p>
                    <p>Your session booking request has been approved by the mentor. Here are the details of your upcoming session:</p>
            
                    <div style='background-color: #edf2f7; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 14px;'>
                        <p style='margin: 4px 0;'><strong>Date:</strong> {dateStr}</p>
                        <p style='margin: 4px 0;'><strong>Time:</strong> {timeRange}</p>
                    </div>
                    <p>Please make sure to be prepared for the session and log in to the website a few minutes before the scheduled time.</p>
            
                    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                    <p style='font-size: 11px; color: #a0aec0; text-align: center; margin: 0;'>This is an automated notification. Please do not reply directly to this email.</p>
                </div>";
            _= _notificationService.SendMessageAsync(traineeEmail, "Session Booking Approved", emailBody);
        }
    }
}
