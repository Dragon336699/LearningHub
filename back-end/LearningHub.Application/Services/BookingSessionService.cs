using LearningHub.Application.Common.Results;
using LearningHub.Application.Common.Constants;
using LearningHub.Application.Dtos.BookingSession;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Application.Mappers;
using LearningHub.Application.Utils;
using LearningHub.Domain.Constants;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Application.Services
{
    public class BookingSessionService : IBookingSessionService
    {
        private readonly IBookingSessionRepository _bookingSessionRepository;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserAvailabilitySettingRepository _userAvailabilitySettingRepository;
        public BookingSessionService(IBookingSessionRepository bookingSessionRepository,
            IUnitOfWork unitOfWork,
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            INotificationService notificationService,
            IHttpContextAccessor httpContextAccessor,
            IUserAvailabilitySettingRepository userAvailabilitySettingRepository)
        {
            _bookingSessionRepository = bookingSessionRepository;
            _unitOfWork = unitOfWork;
            _roleManager = roleManager;
            _userManager = userManager;
            _notificationService = notificationService;
            _httpContextAccessor = httpContextAccessor;
            _userAvailabilitySettingRepository = userAvailabilitySettingRepository;
        }

        public async Task<Result<string>> CreateBookingSessionAsync(CreateBookingSessionRequest request)
        {
            Guid traineeId = TokenUtils.GetNameIdentifier(_httpContextAccessor);

            // tuple for dynamic error validation
            var (isValid, errorMessage, mentor) = await ValidateCreateSessionAsync(request, traineeId);

            if (!isValid)
            {
                return Result<string>.Failure(errorMessage!);
            }

            BookingSession newSession = BookingSessionMappingProfile.ToEntity(request, traineeId);

            await _bookingSessionRepository.AddAsync(newSession);
            await _unitOfWork.CompleteAsync();

            await SendNotificationEmailToMentorAsync(mentor!.Email!, newSession);

            return Result<string>.Success(Messages.BookingSession.CreateSuccess);
        }

        public async Task<Result<string>> ApproveSessionAsync(Guid sessionId)
        {
            Guid mentorId = TokenUtils.GetNameIdentifier(_httpContextAccessor);

            var (isValid, errorMessage, currentSession, trainee) = await ValidateApprovalAsync(sessionId, mentorId);

            if (!isValid)
            {
                return Result<string>.Failure(errorMessage!);
            }

            await _unitOfWork.BeginTransactionAsync();
            try
            {
                currentSession!.Status = SessionStatus.Approved;
                _unitOfWork.BookingSessions.Update(currentSession);

                DateOnly sessionDate = DateOnly.FromDateTime(currentSession.StartTime);
                TimeOnly sessionStartTime = TimeOnly.FromDateTime(currentSession.StartTime);
                TimeOnly sessionEndTime = TimeOnly.FromDateTime(currentSession.EndTime);

                List<UserAvailabilitySetting> mentorAvailabilities = await _userAvailabilitySettingRepository
                    .GetUserAvailabilities(currentSession.MentorId, sessionDate, sessionDate);

                UserAvailabilitySetting? dailySetting = mentorAvailabilities.FirstOrDefault(ua => ua.SettingDay == sessionDate);

                if (dailySetting != null && dailySetting.AvailabilitySlots != null)
                {
                    var bookedSlots = dailySetting.AvailabilitySlots
                        .Where(slot => slot.StartTime < sessionEndTime && slot.EndTime > sessionStartTime)
                        .ToList();

                    foreach (var slot in bookedSlots)
                    {
                        slot.Status = UserAvailabilityStatus.Booked;
                    }
                }

                List<BookingSession> overlappingSessions = await _bookingSessionRepository.GetOverlapingSession(currentSession);
                if (overlappingSessions.Any())
                {
                    overlappingSessions.ForEach(s => s.Status = SessionStatus.Cancelled);
                    _unitOfWork.BookingSessions.UpdateRange(overlappingSessions);
                }

                await _unitOfWork.CommitTransactionAsync();

                await SendNotificationEmailToTraineeAsync(trainee!.Email, currentSession);

                if (overlappingSessions.Any())
                {
                    List<Guid> cancelledTraineeIds = overlappingSessions.Select(s => s.TraineeId).Distinct().ToList();

                    var cancelledTraineesDict = await _userManager.Users
                        .Where(u => cancelledTraineeIds.Contains(u.Id))
                        .ToDictionaryAsync(u => u.Id, u => u.Email);

                    var emailTasks = overlappingSessions
                        .Where(s => cancelledTraineesDict.TryGetValue(s.TraineeId, out var email) && !string.IsNullOrEmpty(email))
                        .Select(s => SendCancellationEmailToTraineeAsync(cancelledTraineesDict[s.TraineeId]!, s));
                    
                    await Task.WhenAll(emailTasks);
                }

                return Result<string>.Success(Messages.BookingSession.ApproveSuccess);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return Result<string>.Failure(Messages.SystemError.DefaultError(ex.Message));
            }
        }

        private async Task SendCancellationEmailToTraineeAsync(string traineeEmail, BookingSession session)
        {
            string timeRange = DateTimeUtils.ToTimeRangeString(session.StartTime, session.EndTime);
            string dateStr = DateTimeUtils.ToDateString(session.StartTime);
            string emailBody = Messages.Email.CancelSessionBody(dateStr, timeRange);

            await _notificationService.SendMessageAsync(traineeEmail, Messages.Email.CancelledSubject, emailBody);
        }

        public async Task<Result<string>> CancelSessionAsync(Guid sessionId)
        {
            string roleName = TokenUtils.GetRoleIdentifier(_httpContextAccessor);

            BookingSession? currentSession = await _bookingSessionRepository
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.Status == SessionStatus.Pending);

            if (currentSession == null)
            {
                return Result<string>.Failure(Messages.BookingSession.NotFoundOrProcessed);
            }

            currentSession.Status = SessionStatus.Cancelled;
            _bookingSessionRepository.Update(currentSession);
            await _unitOfWork.CompleteAsync();
            if (roleName == RoleName.Mentor)
            {
                User? trainee = await _userManager.FindByIdAsync(currentSession.TraineeId.ToString());

                if (trainee != null && !string.IsNullOrEmpty(trainee.Email))
                {
                    await SendCancellationEmailToTraineeAsync(trainee.Email, currentSession);
                }
            }

            return Result<string>.Success(Messages.BookingSession.CancelSuccess);
        }

        public async Task<Result<List<AvailableSlotsResponse>>> GetAvailableSlotsAsync(AvailableSlotsRequest request)
        {
            DateTime targetDate = request.Date.Date;
            DateTime nextDay = targetDate.AddDays(1);
            DateTime currentTime = DateTime.Now;

            int durationMinutes = request.DurationType switch
            {
                SessionDurationType.Minutes15 => 15,
                SessionDurationType.Minutes30 => 30,
                SessionDurationType.Minutes45 => 45,
                SessionDurationType.Hour1 => 60,
                _ => 30
            };

            DateOnly targetDateOnly = DateOnly.FromDateTime(targetDate);

            List<UserAvailabilitySetting> mentorAvailabilities = await _userAvailabilitySettingRepository
                .GetUserAvailabilities(request.MentorId, targetDateOnly, targetDateOnly);

            UserAvailabilitySetting? dailySetting = mentorAvailabilities.FirstOrDefault(ua => ua.SettingDay == targetDateOnly);

            if (dailySetting == null || !dailySetting.AvailabilitySlots.Any())
            {
                return Result<List<AvailableSlotsResponse>>.Success(new List<AvailableSlotsResponse>());
            }

            var baseAvailabilities = dailySetting.AvailabilitySlots
                .Where(slot => slot.Status == UserAvailabilityStatus.Available)
                .Select(slot => (
                    Start: targetDate.Add(slot.StartTime.ToTimeSpan()),
                    End: targetDate.Add(slot.EndTime.ToTimeSpan())
                ))
                .OrderBy(s => s.Start)
                .ToList();

            List<BookingSession> busySlots = await _bookingSessionRepository.GetBusySlotsAsync(request.MentorId, targetDate, nextDay);
            var rawFreeIntervals = GetRawFreeIntervals(baseAvailabilities, busySlots);

            List<AvailableSlotsResponse> availableSlots = GenerateSlotsFromIntervals(
                rawFreeIntervals,
                durationMinutes,
                dailySetting.BufferTimeMinutes,
                currentTime
            );

            return Result<List<AvailableSlotsResponse>>.Success(availableSlots);
        }

        public async Task<Result<List<BookingSessionResponse>>> GetBookingSessions(GetSessionsRequest request)
        {
            Guid? userId = TokenUtils.GetNameIdentifier(_httpContextAccessor);
            List<BookingSession> bookingSessions = await _bookingSessionRepository.GetSessionsByUserAndDateAsync(userId.Value, request.Date, request.Status);
            List<BookingSessionResponse> responses = BookingSessionMappingProfile.ToResponseList(bookingSessions);
            return Result<List<BookingSessionResponse>>.Success(responses);

        }

        // I thought about caching to load role into process memory, but in that case I still have to get roleId from table "UserRole"
        // So I suggested keeping the validation logic like this, because "IsInRoleAsync" can do both get roleId from table "UserRole" and check roleId from table "Role"
        private async Task<(bool IsValid, string? ErrorMessage, User? Mentor)> ValidateCreateSessionAsync(
            CreateBookingSessionRequest request, Guid traineeId)
        {
            User? mentor = await _userManager.FindByIdAsync(request.MentorId.ToString());
            if (mentor == null)
                return (false, Messages.BookingSession.MentorNotFound, null);

            if (!await _userManager.IsInRoleAsync(mentor, RoleName.Mentor))
                return (false, Messages.BookingSession.MentorInvalid, null);

            User? trainee = await _userManager.FindByIdAsync(traineeId.ToString());
            if (trainee == null)
                return (false, Messages.BookingSession.TraineeNotFound, null);

            if (!await _userManager.IsInRoleAsync(trainee, RoleName.Trainee))
                return (false, Messages.BookingSession.TraineeInvalid, null);

            bool isMentorBusy = await _bookingSessionRepository
                .IsUserBusyAsync(request.MentorId, request.StartTime, request.EndTime, RoleName.Mentor);
            if (isMentorBusy)
                return (false, Messages.BookingSession.MentorAlreadyBusy, null);

            bool isTraineeBusy = await _bookingSessionRepository
                .IsUserBusyAsync(traineeId, request.StartTime, request.EndTime, RoleName.Trainee);
            if (isTraineeBusy)
                return (false, Messages.BookingSession.TraineeAlreadyBusy, null);

            bool isSlotAvailable = await IsSlotAvailableAsync(request.MentorId, request.StartTime, request.EndTime);
            if(!isSlotAvailable)
                return (false, Messages.BookingSession.MentorAlreadyBusy, null);

            return (true, null, mentor);
        }

        private async Task<(bool IsValid, string? ErrorMessage, BookingSession? Session, User? Trainee)> ValidateApprovalAsync(Guid sessionId, Guid mentorId)
        {
            var session = await _unitOfWork.BookingSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.Status == SessionStatus.Pending);

            if (session == null)
                return (false, Messages.BookingSession.NotFoundOrProcessed, null, null);

            if (session.MentorId != mentorId)
                return (false, Messages.BookingSession.NotAuthorized, null, null);

            var trainee = await _unitOfWork.Users.GetByIdAsync(session.TraineeId);
            if (trainee == null)
                return (false, Messages.BookingSession.TraineeNotFound, null, null);

            bool isMentorBusy = await _bookingSessionRepository
                .IsUserBusyAsync(session.MentorId, session.StartTime, session.EndTime, RoleName.Mentor);

            if (isMentorBusy)
                return (false, Messages.BookingSession.MentorAlreadyBusy, null, null);

            return (true, null, session, trainee);
        }

        private async Task<bool> IsSlotAvailableAsync(Guid mentorId, DateTime startTime, DateTime endTime)
        {
            DateOnly date = DateOnly.FromDateTime(startTime);
            TimeOnly startT = TimeOnly.FromDateTime(startTime);
            TimeOnly endT = TimeOnly.FromDateTime(endTime);

            // Lấy setting của mentor trong ngày đó
            var mentorAvailabilities = await _userAvailabilitySettingRepository
                .GetUserAvailabilities(mentorId, date, date);

            var dailySetting = mentorAvailabilities.FirstOrDefault(ua => ua.SettingDay == date);

            if (dailySetting == null || dailySetting.AvailabilitySlots == null)
            {
                return false;
            }

            // Kiểm tra xem khoảng thời gian [startT, endT] có nằm trọn trong một slot nào đang "Available" không
            bool isSlotValid = dailySetting.AvailabilitySlots.Any(slot =>
                slot.Status == UserAvailabilityStatus.Available &&
                slot.StartTime <= startT &&
                slot.EndTime >= endT);

            return isSlotValid;
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

        private List<AvailableSlotsResponse> GenerateSlotsFromIntervals(
            List<(DateTime Start, DateTime End)> freeIntervals,
            int durationMinutes,
            int bufferTime,
            DateTime currentTime)
        {
            List<AvailableSlotsResponse> availableSlots = new List<AvailableSlotsResponse>();

            foreach (var interval in freeIntervals)
            {
                DateTime slotStart = interval.Start;

                while (slotStart.AddMinutes(durationMinutes) <= interval.End)
                {
                    DateTime slotEnd = slotStart.AddMinutes(durationMinutes);

                    if (slotStart > currentTime)
                    {
                        availableSlots.Add(new AvailableSlotsResponse
                        {
                            StartTime = slotStart,
                            EndTime = slotEnd
                        });
                    }

                    slotStart = slotEnd.AddMinutes(bufferTime);
                }
            }

            return availableSlots;
        }

        private async Task SendNotificationEmailToMentorAsync(string mentorEmail, BookingSession session)
        {
            string timeRange = DateTimeUtils.ToTimeRangeString(session.StartTime, session.EndTime);
            string dateStr = DateTimeUtils.ToDateString(session.StartTime);
            string emailBody = Messages.Email.RequestSessionBody(dateStr, timeRange);

            await _notificationService.SendMessageAsync(mentorEmail, Messages.Email.NewRequestSubject, emailBody);
        }

        private async Task SendNotificationEmailToTraineeAsync(string traineeEmail, BookingSession session)
        {
            string timeRange = DateTimeUtils.ToTimeRangeString(session.StartTime, session.EndTime);
            string dateStr = DateTimeUtils.ToDateString(session.StartTime);
            string emailBody = Messages.Email.AprroveSessionBody(dateStr, timeRange);
            await _notificationService.SendMessageAsync(traineeEmail, Messages.Email.ApprovedSubject, emailBody);
        }
    }
}
