import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UpsertUserAvailabilityForm } from "../schemas/UpSertUserAvailabilitySchema";
import { userAvailabilityService } from "../services/UserAvailability.service";

export const useUserAvailability = () => {
    return useQuery({
        queryKey: ["user-availability"],
        queryFn: async () => await userAvailabilityService.getUserAvailabilities()
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