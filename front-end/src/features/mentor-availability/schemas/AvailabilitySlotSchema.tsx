import z from "zod";

export const AvailabilitySlotShema = z.object({
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, "Invalid time slot format"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, "Invalid time slot format"),
    status: z.string().optional()
}).refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["startTime"],
});

export type AvailabilitySlotForm = z.infer<typeof AvailabilitySlotShema>;