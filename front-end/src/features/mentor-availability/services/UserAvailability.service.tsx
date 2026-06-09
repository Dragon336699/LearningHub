import { API_ROUTES } from "../../../configs/api_routes";
import { HttpClient } from "../../../lib/client";
import { Result } from "../../../types/result";
import { UpsertUserAvailabilityForm } from "../schemas/UpsertUserAvailabilitySchema";
import { GetUserAvailabilityRequest, UserAvailabilityDto } from "../types/UserAvailability.type";

export const userAvailabilityService = {
    getUserAvailabilities: async (request: GetUserAvailabilityRequest) => {
        const response = await HttpClient.get<Result<UserAvailabilityDto[]>>(`${API_ROUTES.AVAILABILITY.COMMON}`, {
            params: request
        });
        return response.data;
    },

    upsertUserAvailability: async (userAvailability: UpsertUserAvailabilityForm) => {
        const response = await HttpClient.post<Result<UserAvailabilityDto>>(`${API_ROUTES.AVAILABILITY.COMMON}`, userAvailability);
        return response.data;
    },
}