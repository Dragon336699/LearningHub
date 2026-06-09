import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UpsertUserAvailabilityForm } from "../schemas/UpsertUserAvailabilitySchema";
import { userAvailabilityService } from "../services/UserAvailability.service";
import { GetUserAvailabilityRequest } from "../types/UserAvailability.type";

export const useUserAvailability = (request: GetUserAvailabilityRequest) => {
    return useQuery({
        queryKey: ["user-availability", request],
        queryFn: async () => await userAvailabilityService.getUserAvailabilities(request)
    })
}

export const useUpsertUserAvailability = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpsertUserAvailabilityForm) => await userAvailabilityService.upsertUserAvailability(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["user-availability"]})
        }
    })
}