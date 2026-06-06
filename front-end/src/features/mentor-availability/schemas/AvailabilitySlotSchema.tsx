import z from "zod";

export const AvailabilitySlotShema = z.object({
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    status: z.string().optional()
}).refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["startTime"],
});

export type AvailabilitySlotForm = z.infer<typeof AvailabilitySlotShema>;