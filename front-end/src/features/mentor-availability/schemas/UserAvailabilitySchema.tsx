import z from "zod";
import { AvailabilitySlotShema } from "./AvailabilitySlotSchema";

export const UserAvailabilitySchema = z.object({
    id: z.string().optional(),
    workStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    workEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    sessionDurationMinutes: z.number().min(15, "Session duration must be at least 15 minutes").max(60, "Session duration must not exceed 120 minutes"),
    bufferTimeMinutes: z.number().min(15, "Buffer time must be at least 15 minutes").max(60, "Buffer time must not exceed 60 minutes"),
    settingDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    availabilitySlots: z.array(AvailabilitySlotShema)
}).refine((data) => data.workStartTime < data.workEndTime, {
    message: "Work start time must be before work end time",
    path: ["workStartTime"],
});

export type UserAvailabilityForm = z.infer<typeof UserAvailabilitySchema>;