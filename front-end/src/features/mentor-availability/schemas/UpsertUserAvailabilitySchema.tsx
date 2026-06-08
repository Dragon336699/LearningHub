import z from "zod";
import { UserAvailabilitySchema } from "./UserAvailabilitySchema";

export const UpsertUserAvailabilitySchema = z.object({
    availabilities: z.array(UserAvailabilitySchema)
});

export type UpsertUserAvailabilityForm = z.infer<typeof UpsertUserAvailabilitySchema>;