export interface UserAvailabilityDto {
    id: string;
    workStartTime: string;
    workEndTime: string;
    sessionDurationMinutes: number;
    bufferTimeMinutes: number;
    settingDay: string;
    availabilitySlots: AvailabilitySlotDto[]
}

export interface AvailabilitySlotDto {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
}

export interface GetUserAvailabilityRequest {
    startDate: string;
    endDate: string;
}