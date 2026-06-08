import { API_ROUTES } from "../../../configs/api_routes";
import { HttpClient } from "../../../lib/client";
import { Result } from "../../../types/result";
import { UpsertUserAvailabilityForm } from "../schemas/UpsertUserAvailabilitySchema";
import { UserAvailabilityDto } from "../types/UserAvailability.type";

export const userAvailabilityService = {
    getUserAvailabilities: async () => {
        const response = await HttpClient.get<Result<UserAvailabilityDto[]>>(`${API_ROUTES.AVAILABILITY.COMMON}`);
        return response.data;
    },

    upsertUserAvailability: async (userAvailability: UpsertUserAvailabilityForm) => {
        const response = await HttpClient.post<Result<UserAvailabilityDto>>(`${API_ROUTES.AVAILABILITY.COMMON}`, userAvailability);
        return response.data;
    },
}