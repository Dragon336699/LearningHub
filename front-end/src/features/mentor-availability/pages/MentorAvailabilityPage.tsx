import { useEffect, useMemo, useRef, useState } from "react";
import { CustomSelect } from "../../../shared/ui/components/CustomSelect";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpsertUserAvailabilitySchema } from "../schemas/UpsertUserAvailabilitySchema";
import { AvailabilitySlotForm } from "../schemas/AvailabilitySlotSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faSpinner, faWarning } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useUpsertUserAvailability, useUserAvailability } from "../hooks/Availability.hook";
import { Result } from "../../../types/result";
import { UserAvailabilityDto } from "../types/UserAvailability.type";

type TimeSlotsAndDay = {
    timeSlots: TimeSlot[];
    day: string;
}

type TimeSlot = {
    startTime: string;
    endTime: string;
}

type WeekDay = {
    dayOfWeek: string;
    day: number;
    month: string;
    fullDate: Date;
};

const defaultStartTime = "09:00";
const defaultEndTime = "17:00";
const defaultSessionDuration = 30;
const defaultBufferTime = 15;
const convertTimeToString = (time: Date) => {
    return time.toLocaleDateString("sv-SE");
};

const formatTime = (time: string) => {
    const [hh, mm] = time.split(":");
    return `${hh}:${mm}`;
};

const getFullDaysOfWeek = (date: Date) => {
    const today = date;

    const firstDayOfweek = new Date(today);
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    firstDayOfweek.setDate(today.getDate() + diff);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(firstDayOfweek);
        date.setDate(firstDayOfweek.getDate() + i);

        return {
            dayOfWeek: date.toLocaleDateString("en-US", {
                weekday: "short",
            }),
            day: date.getDate(),
            month: date.toLocaleDateString("en-US", {
                month: "short",
            }),
            fullDate: date,
        };
    });
    return weekDays as WeekDay[];
}

export const MentorAvailabilityPage = () => {
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const [timeSlots, setTimeSlots] = useState<TimeSlotsAndDay>();
    const fullDaysOfWeek = useMemo(() => getFullDaysOfWeek(selectedDay), [selectedDay]);
    const [hasBookedSelectDay, setHasBookedSelectDay] = useState(false);
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    const upsertUserAvailabilityMutation = useUpsertUserAvailability();
    const { data: userAvailabilitiesData } = useUserAvailability({
        startDate: convertTimeToString(fullDaysOfWeek[0]?.fullDate),
        endDate: convertTimeToString(fullDaysOfWeek[fullDaysOfWeek.length - 1]?.fullDate)
    });
    const isUserChangeRef = useRef<boolean>(false);
    const isInitialMountRef = useRef(true);

    const userAvailabilityForm = useForm({
        resolver: zodResolver(UpsertUserAvailabilitySchema),
        defaultValues: {
            availabilities: [{
                workStartTime: defaultStartTime,
                workEndTime: defaultEndTime,
                sessionDurationMinutes: defaultSessionDuration,
                bufferTimeMinutes: defaultBufferTime,
                settingDay: convertTimeToString(selectedDay),
                availabilitySlots: []
            }]
        }
    })

    const {
        formState: { isDirty },
    } = userAvailabilityForm;

    const availabilities = useWatch({
        control: userAvailabilityForm.control,
        name: "availabilities",
    });

    const timeOptions = Array.from({ length: 96 }, (_, i) => {
        const hour = Math.floor(i / 4);
        const minute = (i % 4) * 15;

        return `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
    });

    const sessionDurationOptions = [
        { label: "15 minutes", value: 15 },
        { label: "30 minutes", value: 30 },
        { label: "45 minutes", value: 45 },
        { label: "1 hour", value: 60 },
    ];

    const bufferOptions = [
        { label: "15 minutes", value: 15 },
        { label: "30 minutes", value: 30 },
        { label: "45 minutes", value: 45 },
        { label: "1 hour", value: 60 },
    ];

    const availabilityIndex = userAvailabilityForm
        .getValues("availabilities")
        .findIndex(a => a.settingDay === convertTimeToString(selectedDay));

    const currentAvailability = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));

    const errors = userAvailabilityForm.formState.errors.availabilities?.[availabilityIndex];

    const handleWorkStartTimeChange = (value: string) => {
        const { setValue } = userAvailabilityForm;
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));
        if (!setting) {
            return;
        }

        const bookedSlotIndex = setting?.availabilitySlots.findIndex(slot => slot.status === 'Booked');
        if (bookedSlotIndex === -1) {
            setValue(`availabilities.${availabilityIndex}.workStartTime`, value);
            isUserChangeRef.current = true;
            availabilities
            const index = userAvailabilityForm.getValues("availabilities")
                .findIndex(a => a.settingDay === convertTimeToString(selectedDay));
            if (index !== -1) {
                userAvailabilityForm.setValue(`availabilities.${index}.workStartTime`, value, { shouldDirty: true, shouldValidate: false });
                userAvailabilityForm.trigger(`availabilities.${index}.workStartTime`);
            }
            return;
        } else {
            toast.error("Work start time cannot be change when booking exist.")
        }
    }

    const handleWorkEndTimeChange = (value: string) => {
        const { setValue } = userAvailabilityForm;
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));
        if (!setting) {
            return;
        }

        const bookedSlotIndex = setting?.availabilitySlots.findIndex(slot => slot.status === 'Booked');
        if (bookedSlotIndex === -1) {
            isUserChangeRef.current = true;
            setValue(`availabilities.${availabilityIndex}.workEndTime`, value);
            const index = userAvailabilityForm.getValues("availabilities")
                .findIndex(a => a.settingDay === convertTimeToString(selectedDay));
            if (index !== -1) {
                userAvailabilityForm.setValue(`availabilities.${index}.workEndTime`, value, { shouldDirty: true, shouldValidate: false });
            }
            return;
        } else {
            toast.error("Work end time cannot be change when booking exist.")
        }
    }

    const handleSessionDurationChange = (value: string) => {
        const { setValue } = userAvailabilityForm;
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));

        if (!setting) {
            return;
        }
        const index = setting?.availabilitySlots.findIndex(slot => slot.status === 'Booked');

        if (index === -1) {
            isUserChangeRef.current = true;
            setValue(`availabilities.${availabilityIndex}.sessionDurationMinutes`, parseInt(value), { shouldValidate: true, shouldDirty: false });
            return;
        } else {
            toast.error("Cannot change session duration when bookings exist.")
        }
    }

    const handleBufferTimeChange = (value: string) => {
        const { setValue } = userAvailabilityForm;
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));

        if (!setting) {
            return;
        }
        const index = setting?.availabilitySlots.findIndex(slot => slot.status === 'Booked');

        if (index === -1) {
            isUserChangeRef.current = true;
            setValue(`availabilities.${availabilityIndex}.bufferTimeMinutes`, parseInt(value), { shouldValidate: true, shouldDirty: false });
            return;
        } else {
            toast.error("Cannot change buffer time when bookings exist.")
        }
    }

    const handleUpsertUserAvailability = async () => {
        const { getValues } = userAvailabilityForm;

        const data = getValues("availabilities");

        const filteredItems = data.filter((d) => d.settingDay >= convertTimeToString(now));
        try {
            await upsertUserAvailabilityMutation.mutateAsync({
                availabilities: filteredItems
            });
            toast.success("Update availability successfully");
        } catch (errors: Result<any> | any) {
            if (errors) {
                errors.forEach((err: string) => toast.error(err));
                return;
            }

            toast.error("Failed to update user availability");
        }
    }

    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }

    const minutesToTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }



    const generateTimeSlots = (startWorkTime: string, endWorkTime: string, sessionDuration: number, bufferTime: number) => {
        const slots: TimeSlot[] = [];
        let current = timeToMinutes(startWorkTime);
        const end = timeToMinutes(endWorkTime);

        while (current + sessionDuration <= end) {
            const start = current;
            const finish = current + sessionDuration;

            slots.push({ startTime: minutesToTime(start), endTime: minutesToTime(finish) });
            current = finish + bufferTime;
        }
        return slots;
    }

    const handleTimeSlotClick = (slot: TimeSlot) => {
        const { setValue, getValues } = userAvailabilityForm;

        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));
        if (!setting) return;
        const item = {
            workStartTime: setting.workStartTime,
            workEndTime: setting.workEndTime,
            sessionDurationMinutes: setting.sessionDurationMinutes,
            bufferTimeMinutes: setting.bufferTimeMinutes,
            settingDay: convertTimeToString(selectedDay),
            availabilitySlots: []
        }

        let index = availabilities.findIndex((a) => a.settingDay === convertTimeToString(selectedDay));
        if (index === -1) {
            const newAvailabilities = [...availabilities, item];

            setValue("availabilities", newAvailabilities);

            index = newAvailabilities.length - 1;
        };

        const currentSlots = getValues(`availabilities.${index}.availabilitySlots`);

        if (currentSlots.some((s: AvailabilitySlotForm) => formatTime(s.startTime) === formatTime(slot.startTime) && formatTime(s.endTime) === formatTime(slot.endTime) && s.status === 'Booked')) {
            return;
        }

        if (currentSlots.some((s: AvailabilitySlotForm) => formatTime(s.startTime) === formatTime(slot.startTime) && formatTime(s.endTime) === formatTime(slot.endTime))) {
            setValue(`availabilities.${index}.availabilitySlots`, currentSlots.filter((s: AvailabilitySlotForm) => !(formatTime(s.startTime) === formatTime(slot.startTime) && formatTime(s.endTime) === formatTime(slot.endTime))), { shouldDirty: true });
            isInitialMountRef.current = false;
            return;
        }

        setValue(`availabilities.${index}.availabilitySlots`, [...currentSlots, slot].sort((a, b) => a.startTime.localeCompare(b.startTime)), { shouldDirty: true });
        isInitialMountRef.current = false;
    }

    const handleBeforeWeek = () => {
        const firstDayOfWeek = new Date(fullDaysOfWeek[0]?.fullDate);
        const lastDayOfWeek = new Date(fullDaysOfWeek[fullDaysOfWeek.length - 1]?.fullDate);
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() - 7);

        if (convertTimeToString(lastDayOfWeek) < convertTimeToString(now)) {
            toast.error("Cannot go to a past week");
            return;
        }

        if (firstDayOfWeek < now) {
            setSelectedDay(now);
            return;
        }
        setSelectedDay(firstDayOfWeek);
    }

    const handleCurrentWeek = () => {
        setSelectedDay(now);
    }

    const handleNextWeek = () => {
        const firstDayOfWeek = new Date(fullDaysOfWeek[0]?.fullDate);
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
        setSelectedDay(firstDayOfWeek);
    }

    const handleAllSlotsInday = () => {
        const { setValue, getValues } = userAvailabilityForm;
        const availabilitiesInDay = getValues("availabilities");

        let index = availabilitiesInDay.findIndex((a) => a.settingDay === convertTimeToString(selectedDay));
        if (index === -1) return;

        const bookedSlots = availabilitiesInDay[index]?.availabilitySlots.filter(a => a.status === 'Booked') ?? [];

        const bookedStartTimes = new Set(
            bookedSlots?.map((slot) => formatTime(slot.startTime))
        );

        const availableSlots = (timeSlots?.timeSlots ?? []).filter((timeSlot) => {
            const isBooked = bookedStartTimes.has(formatTime(timeSlot.startTime));
            const isPastTime = convertTimeToString(selectedDay) === convertTimeToString(now) && timeSlot.startTime <= currentTime;

            return !isBooked && !isPastTime;
        })

        const currentSlots = availabilitiesInDay[index]?.availabilitySlots;

        const map = new Map<string, any>();

        const allSlots = [
            ...availableSlots,
            ...bookedSlots,
            ...currentSlots,
        ];

        allSlots.forEach(slot => {
            const key = `${(formatTime(slot.startTime))}-${formatTime(slot.endTime)}`;
            map.set(key, slot);
        });

        const newTimeSlots = Array.from(map.values());

        setValue(`availabilities.${index}.availabilitySlots`, newTimeSlots, { shouldDirty: true });
        isInitialMountRef.current = false;
    }

    const handleClearAllSlotsInDay = () => {
        const { setValue, getValues } = userAvailabilityForm;
        const availabilitiesInDay = getValues("availabilities");

        if (availabilityIndex === -1) return;

        const currentSlots = availabilitiesInDay[availabilityIndex].availabilitySlots;
        const currentSetting = availabilitiesInDay[availabilityIndex];
        const bookedAndPastSlots = currentSlots.filter(slot => slot.status === 'Booked' || (slot.startTime < formatTime(currentTime) && currentSetting.settingDay === convertTimeToString(now)) || currentSetting.settingDay < convertTimeToString(now));

        setValue(`availabilities.${availabilityIndex}.availabilitySlots`, bookedAndPastSlots ?? [], { shouldDirty: true });
    }

    const handleCopySlotToAllDays = () => {
        isInitialMountRef.current = false;
        const { setValue } = userAvailabilityForm;

        const availableDays = fullDaysOfWeek.filter(d => convertTimeToString(d.fullDate) >= convertTimeToString(now) && convertTimeToString(d.fullDate) !== convertTimeToString(selectedDay));
        const index = availabilities.findIndex((a) => a.settingDay === convertTimeToString(selectedDay));

        const todaySlots = index !== -1 ? availabilities[index].availabilitySlots : [];

        const slotsCopy = index !== -1 ? availabilities[index].availabilitySlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: undefined
        })) : [];

        const resetItem = {
            workStartTime: availabilities[availabilityIndex]?.workStartTime,
            workEndTime: availabilities[availabilityIndex]?.workEndTime,
            sessionDurationMinutes: availabilities[availabilityIndex]?.sessionDurationMinutes,
            bufferTimeMinutes: availabilities[availabilityIndex]?.bufferTimeMinutes,
            settingDay: convertTimeToString(selectedDay),
            availabilitySlots: todaySlots
        }

        const newAvailabilties = [
            resetItem,
            ...availableDays.map((ad) => {
                const existingDay = availabilities.find((a) => a.settingDay === convertTimeToString(ad.fullDate));
                const bookedSlots = existingDay?.availabilitySlots.filter(ad => ad.status === "Booked") ?? [];

                let daySlots = slotsCopy.filter(slot =>
                    !(convertTimeToString(ad.fullDate) === convertTimeToString(now) && formatTime(slot.startTime) < formatTime(currentTime))
                );

                let pastSlots = existingDay?.availabilitySlots.filter(slot => slot.startTime < formatTime(currentTime) && existingDay.settingDay <= convertTimeToString(now)) ?? [];

                if (bookedSlots.length !== 0 && existingDay?.workStartTime === availabilities[availabilityIndex].workStartTime && existingDay.workEndTime === availabilities[availabilityIndex].workEndTime && existingDay.sessionDurationMinutes === availabilities[availabilityIndex].sessionDurationMinutes && existingDay.bufferTimeMinutes === availabilities[availabilityIndex].bufferTimeMinutes) {
                    daySlots = daySlots.filter(ds => {
                        const bookedSlotIndex = bookedSlots.findIndex(bs => formatTime(bs.startTime) === formatTime(ds.startTime) || formatTime(bs.endTime) === formatTime(ds.endTime));
                        return bookedSlotIndex === -1;
                    });
                } else if (bookedSlots.length !== 0 && (existingDay?.workStartTime !== availabilities[availabilityIndex].workStartTime || existingDay?.workEndTime !== availabilities[availabilityIndex].workEndTime || existingDay?.sessionDurationMinutes !== availabilities[availabilityIndex].sessionDurationMinutes || existingDay?.bufferTimeMinutes !== availabilities[availabilityIndex].bufferTimeMinutes)) {
                    daySlots = [];

                    const map = new Map();

                    [...bookedSlots, ...pastSlots, ...daySlots].sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach(slot => {
                        const key = `${(formatTime(slot.startTime))}-${formatTime(slot.endTime)}`;
                        map.set(key, slot);
                    });

                    const newSlots = Array.from(map.values());
                    return {
                        workStartTime: existingDay?.workStartTime ?? availabilities[availabilityIndex].workStartTime,
                        workEndTime: existingDay?.workEndTime ?? availabilities[availabilityIndex].workEndTime,
                        sessionDurationMinutes: existingDay?.sessionDurationMinutes ?? availabilities[availabilityIndex].sessionDurationMinutes,
                        bufferTimeMinutes: existingDay?.bufferTimeMinutes ?? availabilities[availabilityIndex].bufferTimeMinutes,
                        settingDay: convertTimeToString(ad.fullDate),
                        availabilitySlots: newSlots
                    }
                }
                const map = new Map();

                [...bookedSlots, ...pastSlots, ...daySlots].sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach(slot => {
                    const key = `${(formatTime(slot.startTime))}-${formatTime(slot.endTime)}`;
                    map.set(key, slot);
                });

                const newSlots = Array.from(map.values());

                return {
                    workStartTime: availabilities[availabilityIndex].workStartTime,
                    workEndTime: availabilities[availabilityIndex].workEndTime,
                    sessionDurationMinutes: availabilities[availabilityIndex].sessionDurationMinutes,
                    bufferTimeMinutes: availabilities[availabilityIndex].bufferTimeMinutes,
                    settingDay: convertTimeToString(ad.fullDate),
                    availabilitySlots: newSlots
                }
            })
        ]

        const pastSetting = availabilities.filter(a => a.settingDay < convertTimeToString(now));

        setValue("availabilities", [...pastSetting, ...newAvailabilties], { shouldDirty: true });
    }

    useEffect(() => {
        const { setValue, getValues } = userAvailabilityForm;
        const todayKey = convertTimeToString(selectedDay);
        const all = getValues("availabilities");
        const index = all.findIndex((a) => a.settingDay === todayKey);

        if (index === -1) {
            setValue(
                "availabilities",
                [...all, {
                    workStartTime: defaultStartTime,
                    workEndTime: defaultEndTime,
                    sessionDurationMinutes: defaultSessionDuration,
                    bufferTimeMinutes: defaultBufferTime,
                    settingDay: todayKey,
                    availabilitySlots: [],
                }],
                { shouldValidate: true, shouldDirty: false }
            );
        }

        const bookingIndex = (index !== -1 ? all[index] : null)
            ?.availabilitySlots.findIndex((slot) => slot?.status === "Booked");
        setHasBookedSelectDay(bookingIndex !== undefined && bookingIndex !== -1);

    }, [selectedDay]);

    useEffect(() => {
        const current = availabilities[availabilityIndex];
        if (!current) return;

        setTimeSlots({
            timeSlots: generateTimeSlots(
                current.workStartTime,
                current.workEndTime,
                current.sessionDurationMinutes,
                current.bufferTimeMinutes
            ),
            day: convertTimeToString(selectedDay)
        });
    }, [availabilities[availabilityIndex]]);

    useEffect(() => {
        const { setValue, getValues } = userAvailabilityForm;
        const allAvailabilities = getValues("availabilities");
        const index = allAvailabilities.findIndex(a => a.settingDay === convertTimeToString(selectedDay));

        const current = allAvailabilities[index];
        if (!current) return;

        const existingSlots = !isUserChangeRef.current && index !== -1
            ? current.availabilitySlots
            : [];

        isUserChangeRef.current = false;

        // if (isInitialMountRef.current) {
        //     isInitialMountRef.current = false;
        //     return;
        // }

        const item = {
            workStartTime: current.workStartTime,
            workEndTime: current.workEndTime,
            sessionDurationMinutes: current.sessionDurationMinutes,
            bufferTimeMinutes: current.bufferTimeMinutes,
            settingDay: convertTimeToString(selectedDay),
            availabilitySlots: existingSlots
        };

        if (index === -1) {
            setValue("availabilities", [...allAvailabilities, item], { shouldValidate: true, shouldDirty: true });
        } else {
            setValue(`availabilities.${index}`, item, { shouldValidate: true, shouldDirty: false });
        }
    }, [availabilities[availabilityIndex]]);

    useEffect(() => {
        setTimeSlots((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                day: convertTimeToString(selectedDay)
            }
        });

        const day = convertTimeToString(selectedDay);

        const availability = userAvailabilityForm
            .getValues("availabilities")
            .find(x => x.settingDay === day);

        if (availability) {
            isInitialMountRef.current = true;
        }
    }, [selectedDay])

    useEffect(() => {
        if (!userAvailabilitiesData) return;

        const { getValues, reset } = userAvailabilityForm;
        const currentAvailabilities = getValues("availabilities");

        if (userAvailabilitiesData.length === 0) {
            if (currentAvailabilities.length === 0) {
                reset({ availabilities: currentAvailabilities });
            }
            return;
        }

        const mapped = userAvailabilitiesData.map((x: UserAvailabilityDto) => ({
            id: x.id,
            workStartTime: formatTime(x.workStartTime),
            workEndTime: formatTime(x.workEndTime),
            sessionDurationMinutes: x.sessionDurationMinutes,
            bufferTimeMinutes: x.bufferTimeMinutes,
            settingDay: x.settingDay,
            availabilitySlots: x.availabilitySlots.map((slot) => ({
                id: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: slot.status,
            })),
        }));

        const fetchedDays = new Set(mapped.map((m) => m.settingDay));

        const preserved = currentAvailabilities.filter(
            (a) => !fetchedDays.has(a.settingDay)
        );

        const todayKey = convertTimeToString(selectedDay);
        const hasTodayEntry = mapped.some((m) => m.settingDay === todayKey);

        const merged = [
            ...preserved,
            ...mapped,
            ...(hasTodayEntry ? [] : [{
                workStartTime: defaultStartTime,
                workEndTime: defaultEndTime,
                sessionDurationMinutes: defaultSessionDuration,
                bufferTimeMinutes: defaultBufferTime,
                settingDay: todayKey,
                availabilitySlots: [],
            }]),
        ];

        reset({ availabilities: merged });
    }, [userAvailabilitiesData]);

    return (
        <div className="p-8 rounded-lg bg-card text-white min-h-full h-auto">
            <div className="flex justify-between items-center">
                <div className="mb-4 flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Manage Your Availability</h1>
                    {hasBookedSelectDay && <p className="text-danger text-xs"><FontAwesomeIcon icon={faWarning} />There are bookings today. You cannot change the settings.</p>}
                </div>
                <button disabled={!isDirty} onClick={async () => {
                    userAvailabilityForm.handleSubmit(handleUpsertUserAvailability)();
                }} className="bg-primary hover:bg-primary-hover rounded-lg p-4 mb-4 cursor-pointer disabled:opacity-50 disabled:hover:bg-primary">Save changes</button>
            </div>

            <hr className="border-gray-600 -mx-4 mb-4" />

            <div className="flex gap-6">
                <div className="w-[30%]">
                    <div className="flex flex-col">
                        <div className="bg-muted rounded-lg px-3 py-4 mb-4">
                            <h2 className="text-lg font-semibold mb-4 ml-2">Work hours</h2>
                            <div className="flex gap-2 justify-between mb-2">
                                <div
                                    className={`flex-1 ${hasBookedSelectDay ? "pointer-events-none opacity-50" : ""
                                        }`}
                                >
                                    <p className="text-sm text-muted-foreground ml-2 mb-1">
                                        Start Time
                                    </p>

                                    <CustomSelect
                                        options={timeOptions.map(time => ({
                                            label: time,
                                            value: time
                                        }))}
                                        value={currentAvailability?.workStartTime ?? defaultStartTime}
                                        onChange={(value: string) => handleWorkStartTimeChange(value)}
                                        getLabel={(status) => status.label}
                                        getValue={(status) => status.value}
                                    />

                                    {errors && (
                                        <p className="text-xs text-danger"> <FontAwesomeIcon icon={faWarning} /> {errors.workStartTime?.message}</p>
                                    )}
                                </div>
                                <div className={`flex-1 ${hasBookedSelectDay ? 'pointer-events-none opacity-50' : ''}`}>
                                    <p className="text-sm text-muted-foreground ml-2 mb-1">End Time</p>
                                    <CustomSelect
                                        options={timeOptions.map((time) => ({ label: time, value: time }))}
                                        value={currentAvailability?.workEndTime ?? defaultEndTime} onChange={(value: string) => handleWorkEndTimeChange(value)}
                                        getLabel={(status) => status.label}
                                        getValue={(status) => status.value} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg px-3 py-4 mb-4">
                            <h2 className="text-lg font-semibold mb-4 ml-2">Session settings</h2>
                            <div className="flex flex-col gap-2">
                                <div className={`flex-1 ${hasBookedSelectDay ? 'pointer-events-none opacity-50' : ''}`}>
                                    <p className="text-sm text-muted-foreground ml-2 mb-1">Session duration</p>
                                    <CustomSelect
                                        options={sessionDurationOptions.map((duration) => duration)}
                                        value={currentAvailability?.sessionDurationMinutes.toString() ?? defaultSessionDuration.toString()} onChange={(value: string) => handleSessionDurationChange(value)}

                                        getLabel={(status) => status.label.toString()}
                                        getValue={(status) => status.value.toString()} />
                                </div>
                                <div className={`flex-1 ${hasBookedSelectDay ? 'pointer-events-none opacity-50' : ''}`}>
                                    <p className="text-sm text-muted-foreground ml-2 mb-1">Buffer time between sessions</p>
                                    <CustomSelect
                                        options={bufferOptions.map((buffer) => buffer)}
                                        value={currentAvailability?.bufferTimeMinutes.toString() ?? defaultBufferTime.toString()} onChange={(value: string) => handleBufferTimeChange(value)}
                                        getLabel={(status) => status.label.toString()}
                                        getValue={(status) => status.value.toString()} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg px-3 py-4 mb-4">
                            <h2 className="text-lg font-semibold mb-4 ml-2">Calendar Navigation</h2>
                            <div className="flex flex-col gap-2">
                                <div className="flex-1 flex justify-between">
                                    <button onClick={handleBeforeWeek} className="hover:bg-card active:bg-card/80 p-1 rounded-sm"><FontAwesomeIcon icon={faArrowLeft} /></button>
                                    <div>
                                        {fullDaysOfWeek[0]?.month} {fullDaysOfWeek[0]?.day} - {fullDaysOfWeek[fullDaysOfWeek.length - 1]?.month} {fullDaysOfWeek[fullDaysOfWeek.length - 1]?.day}
                                    </div>
                                    <button onClick={handleNextWeek} className="hover:bg-card active:bg-card/80 p-1 rounded-sm"><FontAwesomeIcon icon={faArrowRight} /></button>
                                </div>
                                <div className="flex-1">
                                    <button onClick={handleCurrentWeek} className="w-full bg-card py-2 items-center hover:bg-sidebar-hover active:bg-card/80 p-1 rounded-sm">Go to current week</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg px-3 py-4 mb-4">
                            <h2 className="text-lg font-semibold mb-4 ml-2">Bulk Actions</h2>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleAllSlotsInday()} className="bg-info rounded-md py-2 cursor-pointer hover:bg-info-hover">Select all slots for {selectedDay.toLocaleDateString("en-US", {
                                    weekday: "short",
                                })} {selectedDay.toLocaleDateString("en-US", {
                                    month: "short",
                                })} {selectedDay.toLocaleDateString("en-US", {
                                    day: "numeric"
                                })}</button>

                                <button onClick={() => handleClearAllSlotsInDay()} className="bg-card rounded-md py-2 cursor-pointer hover:bg-card/80">Clear all slots for {selectedDay.toLocaleDateString("en-US", {
                                    weekday: "short",
                                })} {selectedDay.toLocaleDateString("en-US", {
                                    month: "short",
                                })} {selectedDay.toLocaleDateString("en-US", {
                                    day: "numeric"
                                })}</button>

                                <button onClick={() => handleCopySlotToAllDays()} className="bg-success rounded-md py-2 cursor-pointer hover:bg-success-hover">Copy schedule to all days</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex">
                        {fullDaysOfWeek.map((day) => (
                            <div onClick={() => setSelectedDay(day.fullDate)}
                                className={`flex flex-col 
                                items-center flex-1 bg-muted 
                                py-4 border-r border-slate-700 
                                select-none 
                                ${selectedDay?.toDateString() === day.fullDate.toDateString() ? "bg-primary hover:bg-primary cursor-default" : "hover:bg-muted-foreground cursor-pointer"}`}
                                key={day.fullDate.toISOString()}>
                                <h3>{day.dayOfWeek}</h3>
                                <p>{day.month} {day.day}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-xl font-semibold my-4">Set your availability for {selectedDay?.toLocaleDateString("en-US", { weekday: "long" })}, {selectedDay?.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</h2>

                    <div className="flex flex-wrap gap-2">
                        {timeSlots?.timeSlots.map((slot, index) => {
                            const availabilityIndex = availabilities.findIndex(
                                a => a.settingDay === convertTimeToString(selectedDay)
                            );

                            const currentSlots = availabilityIndex !== -1 ? availabilities
                            [availabilityIndex].availabilitySlots : [];


                            const isSelected = currentSlots.some(
                                s =>
                                    formatTime(s.startTime) === slot.startTime &&
                                    formatTime(s.endTime) === slot.endTime &&
                                    timeSlots.day === convertTimeToString(selectedDay)
                            );

                            const isBooked = currentSlots.some(
                                s =>
                                    formatTime(s.startTime) === slot.startTime &&
                                    formatTime(s.endTime) === slot.endTime &&
                                    s.status === 'Booked'
                            );

                            const isDisabled = (convertTimeToString(selectedDay) === convertTimeToString(now) && slot.startTime < currentTime) || convertTimeToString(selectedDay) < convertTimeToString(now);
                            return (
                                <button
                                    disabled={isDisabled}
                                    key={index}
                                    onClick={() => handleTimeSlotClick(slot)}
                                    className={`flex justify-center items-center w-1/5 rounded-lg px-1 py-4 m-2 ${!isBooked ? 'cursor-pointer' : ''} ${isSelected
                                        ? "bg-primary"
                                        : "bg-muted hover:bg-muted-foreground"
                                        } ${isBooked ? '!bg-info' : ''} disabled:cursor-not-allowed disabled:opacity-50 ${isDisabled && isSelected ? 'disabled:hover:bg-primary' : 'disabled:hover:bg-muted'}`}
                                >
                                    <div className="flex flex-col">
                                        <p>{slot.startTime} - {slot.endTime}</p>
                                        {isDisabled && <p>Past</p>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <h2 className="text-xl font-semibold my-4">Availability preview</h2>
                    <div>
                        <div className="flex">
                            {fullDaysOfWeek.map((day) => (
                                <div className="flex-1">
                                    <div
                                        className="flex flex-col items-center flex-1 py-4 border-r border-slate-700 select-none"
                                        key={day.fullDate.toISOString()}>
                                        <h3>{day.dayOfWeek}</h3>
                                        <p>{day.month} {day.day}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        {availabilities
                                            ?.find(
                                                (a) =>
                                                    convertTimeToString(new Date(a.settingDay)) ===
                                                    convertTimeToString(day.fullDate)
                                            )
                                            ?.availabilitySlots?.map((slot) => (
                                                <div className={`flex text-sm justify-center items-center ${slot.status === 'Booked' ? 'bg-info' : 'bg-primary'} rounded-md mt-1 mb-1s mx-1 py-2`} key={slot.startTime}>
                                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
                            <p>
                                <span className="font-medium text-foreground">Working hours:</span>{" "}
                                {currentAvailability?.workStartTime ?? defaultStartTime} - {currentAvailability?.workEndTime ?? defaultEndTime}
                                <span className="mx-2">•</span>
                                <span className="font-medium text-foreground">Session:</span>{" "}
                                {sessionDurationOptions.find((x) => x.value === currentAvailability?.sessionDurationMinutes)?.label}
                                <span className="mx-2">•</span>
                                <span className="font-medium text-foreground">Buffer:</span>{" "}
                                {bufferOptions.find((x) => x.value === currentAvailability?.bufferTimeMinutes)?.label}
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-xs bg-primary mb-[1px]" />
                                    <span>Available</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-xs bg-info mb-[1px]" />
                                    <span>Booked</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {upsertUserAvailabilityMutation.isPending && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-50">
                    <div className="flex flex-col items-center gap-2 text-white">
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className="text-xl"
                        />
                        <span className="text-sm">Processing...</span>
                    </div>
                </div>
            )}
        </div>
    )
}