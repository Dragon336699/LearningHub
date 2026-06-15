export interface BookingSession {
    id: string;
    mentorId: string;
    traineeId: string;
    startTime: string;
    endTime: string;
    sessionType: string;
    topic: string;
    status: string;
    createdAt: string;
}

export interface CreateBookingSessionRequest {
  mentorId: string;
  sessionType: number;
  topic?: string;
  startTime: string; 
  endTime: string;   
}

export interface AvailableSlotsRequest {
  mentorId: string;
  date: string;
  durationType: number;
}

export interface AvailableSlotsResponse {
  startTime: string;
  endTime: string;
  displayText: string;
}

export interface SessionResponse {
  id: string;
  mentorId: string;
  mentorName: string;
  traineeId: string;
  traineeName: string;
  startTime: string;
  endTime: string;
  topic: string;
  sessionType: string;
  sessionStatus: string;
}

export interface GetSessionsRequest {
  date: string; // YYYY-MM-DD
  sessionStatus?: string; 
}

