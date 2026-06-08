import { useEffect, useRef, useState } from "react";
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

export const MentorAvailabilityPage = () => {
    const [startTime, setStartTime] = useState(defaultStartTime);
    const [endTime, setEndTime] = useState(defaultEndTime);
    const [sessionDuration, setSessionDuration] = useState(defaultSessionDuration);
    const [bufferTime, setBufferTime] = useState(defaultBufferTime);
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const [timeSlots, setTimeSlots] = useState<TimeSlotsAndDay>();
    const [fullDaysOfWeek, setFullDaysOfWeek] = useState<WeekDay[]>([]);
    const [hasBookedSelectDay, setHasBookedSelectDay] = useState(false);
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    const upsertUserAvailabilityMutation = useUpsertUserAvailability();
    const { data: userAvailabilitiesData } = useUserAvailability();
    const isUserChangeRef = useRef<boolean>(false);

    const userAvailabilityForm = useForm({
        resolver: zodResolver(UpsertUserAvailabilitySchema),
        defaultValues: {
            availabilities: [{
                workStartTime: startTime,
                workEndTime: endTime,
                sessionDurationMinutes: sessionDuration,
                bufferTimeMinutes: bufferTime,
                settingDay: convertTimeToString(selectedDay),
                availabilitySlots: []
            }]
        }
    })

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

    const handleWorkStartTimeChange = (value: string) => {
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));

        if (!setting) return;
        const firstBookSlotInDay = setting?.availabilitySlots.find(slot => slot.status === 'Booked');

        if (!firstBookSlotInDay) {
            isUserChangeRef.current = true;
            setStartTime(value);
            return;
        } else {
            toast.error("Work start time cannot be change when booking exist.")
        }
    }

    const handleWorkEndTimeChange = (value: string) => {
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));

        if (!setting) return;
        const lastBookSlotInDay = setting?.availabilitySlots.find(slot => slot.status === 'Booked');

        if (!lastBookSlotInDay) {
            isUserChangeRef.current = true;
            setEndTime(value);
            return;
        } else {
            toast.error("Work end time cannot be change when booking exist.")
        }
    }

    const handleSessionDurationChange = (value: string) => {
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));

        if (!setting) return;
        const index = setting?.availabilitySlots.findIndex(slot => slot.status === 'Booked');

        if (index === -1) {
            isUserChangeRef.current = true;
            setSessionDuration(parseInt(value));
            return;
        } else {
            toast.error("Cannot change session duration when bookings exist.")
        }
    }

    const handleBufferTimeChange = (value: string) => {
        const setting = availabilities.find(a => a.settingDay === convertTimeToString(selectedDay));

        if (!setting) return;
        const index = setting?.availabilitySlots.findIndex(slot => slot.status === 'Booked');

        if (index === -1) {
            isUserChangeRef.current = true;
            setBufferTime(parseInt(value));
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
        return weekDays;
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

        const item = {
            workStartTime: startTime,
            workEndTime: endTime,
            sessionDurationMinutes: sessionDuration,
            bufferTimeMinutes: bufferTime,
            settingDay: convertTimeToString(selectedDay),
            availabilitySlots: []
        }


        const availabilities = getValues("availabilities");

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
            setValue(`availabilities.${index}.availabilitySlots`, currentSlots.filter((s: AvailabilitySlotForm) => !(formatTime(s.startTime) === formatTime(slot.startTime) && formatTime(s.endTime) === formatTime(slot.endTime))))
            return;
        }

        setValue(`availabilities.${index}.availabilitySlots`, [...currentSlots, slot]);
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

        const currentTime = now.toTimeString().split(" ")[0];

        const availableSlots = (timeSlots?.timeSlots ?? []).filter((timeSlot) => {
            const isBooked = bookedStartTimes.has(formatTime(timeSlot.startTime));
            const isPastTime = convertTimeToString(selectedDay) === convertTimeToString(now) && timeSlot.startTime <= currentTime;

            return !isBooked && !isPastTime;
        })

        const newTimeSlots = [...availableSlots, ...bookedSlots];

        setValue(`availabilities.${index}.availabilitySlots`, newTimeSlots);
    }

    const handleClearAllSlotsInDay = () => {
        const { setValue, getValues } = userAvailabilityForm;
        const availabilitiesInDay = getValues("availabilities");
        let index = availabilitiesInDay.findIndex((a) => a.settingDay === convertTimeToString(selectedDay));

        if (index === -1) return;

        const currentSlots = availabilitiesInDay[index].availabilitySlots;
        const bookedSlots = currentSlots.filter(slot => slot.status === 'Booked');

        setValue(`availabilities.${index}.availabilitySlots`, bookedSlots ?? []);
    }

    const handleCopySlotToAllDays = () => {
        const availableDays = fullDaysOfWeek.filter(d => convertTimeToString(d.fullDate) >= convertTimeToString(now) && convertTimeToString(d.fullDate) !== convertTimeToString(selectedDay));
        const index = availabilities.findIndex((a) => a.settingDay === convertTimeToString(selectedDay));

        const todaySlots = index !== -1 ? availabilities[index].availabilitySlots : [];

        const slotsCopy = index !== -1 ? availabilities[index].availabilitySlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: undefined
        })) : [];

        const resetItem = {
            workStartTime: startTime,
            workEndTime: endTime,
            sessionDurationMinutes: sessionDuration,
            bufferTimeMinutes: bufferTime,
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

                if (bookedSlots.length !== 0 && existingDay?.workStartTime === startTime && existingDay.workEndTime === endTime && existingDay.sessionDurationMinutes === sessionDuration && existingDay.bufferTimeMinutes === bufferTime) {
                    daySlots = daySlots.filter(ds => {
                        const bookedSlotIndex = bookedSlots.findIndex(bs => bs.startTime === ds.startTime || bs.endTime === ds.endTime);
                        return !bookedSlotIndex;
                    });
                } else if (bookedSlots.length !== 0 && (existingDay?.workStartTime !== startTime || existingDay?.workEndTime !== endTime || existingDay?.sessionDurationMinutes !== sessionDuration || existingDay?.bufferTimeMinutes !== bufferTime)) {
                    daySlots = [];

                    return {
                        workStartTime: existingDay?.workStartTime,
                        workEndTime: existingDay?.workEndTime,
                        sessionDurationMinutes: existingDay?.sessionDurationMinutes,
                        bufferTimeMinutes: existingDay?.bufferTimeMinutes,
                        settingDay: convertTimeToString(ad.fullDate),
                        availabilitySlots: [...bookedSlots, ...daySlots]
                    }
                }

                return {
                    workStartTime: startTime,
                    workEndTime: endTime,
                    sessionDurationMinutes: sessionDuration,
                    bufferTimeMinutes: bufferTime,
                    settingDay: convertTimeToString(ad.fullDate),
                    availabilitySlots: [...bookedSlots, ...daySlots]
                }
            })
        ]

        userAvailabilityForm.reset({
            availabilities: newAvailabilties
        })
    }

    useEffect(() => {
        setFullDaysOfWeek(getFullDaysOfWeek(selectedDay));
        const { setValue } = userAvailabilityForm;
        const item = {
            workStartTime: startTime,
            workEndTime: endTime,
            sessionDurationMinutes: sessionDuration,
            bufferTimeMinutes: bufferTime,
            settingDay: convertTimeToString(selectedDay),
            availabilitySlots: []
        }

        let index = availabilities.findIndex((a) => a.settingDay === convertTimeToString(selectedDay));

        let currentAvailabilities = availabilities;
        if (index === -1) {
            currentAvailabilities = [...availabilities, item];

            setValue("availabilities", currentAvailabilities);

            index = currentAvailabilities.length - 1;
        };

        const selectedDaySlots = currentAvailabilities[index];
        const bookingIndex = selectedDaySlots?.availabilitySlots.findIndex(slot => slot?.status === 'Booked');

        if (bookingIndex !== -1) {
            setHasBookedSelectDay(true);
        } else {
            setHasBookedSelectDay(false);
        }
    }, [selectedDay])

    useEffect(() => {
        setTimeSlots({
            timeSlots: generateTimeSlots(startTime, endTime, sessionDuration, bufferTime),
            day: convertTimeToString(selectedDay)
        });
    }, [startTime, endTime, sessionDuration, bufferTime]);

    useEffect(() => {
        const { setValue, getValues } = userAvailabilityForm;
        const availabilities = getValues("availabilities");
        const index = availabilities.findIndex((a) => a.settingDay === convertTimeToString(selectedDay));

        const existingSlots = !isUserChangeRef.current && index !== -1
            ? availabilities[index].availabilitySlots
            : [];

        isUserChangeRef.current = false;

        const item = {
            workStartTime: startTime,
            workEndTime: endTime,
            sessionDurationMinutes: sessionDuration,
            bufferTimeMinutes: bufferTime,
            settingDay: convertTimeToString(selectedDay),
            availabilitySlots: existingSlots
        }

        if (index === -1) {
            setValue("availabilities", [...availabilities, item]);
        } else {
            setValue(`availabilities.${index}`, item);
        }
    }, [startTime, endTime, sessionDuration, bufferTime])

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
            setStartTime(availability.workStartTime);
            setEndTime(availability.workEndTime);
            setSessionDuration(availability.sessionDurationMinutes);
            setBufferTime(availability.bufferTimeMinutes);
        }

    }, [selectedDay])

    useEffect(() => {
        if (!userAvailabilitiesData || userAvailabilitiesData.length === 0) return;

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
                status: slot.status
            }))
        }));

        userAvailabilityForm.reset({ availabilities: mapped });

        const todayKey = convertTimeToString(selectedDay);
        const todayAvailability = mapped.find(x => x.settingDay === todayKey);

        if (todayAvailability) {
            setStartTime(todayAvailability.workStartTime);
            setEndTime(todayAvailability.workEndTime);
            setSessionDuration(todayAvailability.sessionDurationMinutes);
            setBufferTime(todayAvailability.bufferTimeMinutes);
        }
    }, [userAvailabilitiesData])

    return (
        <div className="p-8 rounded-lg bg-card text-white min-h-full h-auto">
            <div className="flex justify-between items-center">
                <div className="mb-4 flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Manage Your Availability</h1>
                    {hasBookedSelectDay && <p className="text-danger text-sm"><FontAwesomeIcon icon={faWarning} />There are bookings today. You cannot change the settings.</p>}
                </div>
                <button onClick={(handleUpsertUserAvailability)} className="bg-primary hover:bg-primary-hover rounded-lg p-4 mb-4 cursor-pointer">Save changes</button>
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
                                        value={startTime}
                                        onChange={(value: string) => handleWorkStartTimeChange(value)}
                                        getLabel={(status) => status.label}
                                        getValue={(status) => status.value}
                                    />
                                </div>
                                <div className={`flex-1 ${hasBookedSelectDay ? 'pointer-events-none opacity-50' : ''}`}>
                                    <p className="text-sm text-muted-foreground ml-2 mb-1">End Time</p>
                                    <CustomSelect
                                        options={timeOptions.map((time) => ({ label: time, value: time }))}
                                        value={endTime} onChange={(value: string) => handleWorkEndTimeChange(value)}
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
                                        value={sessionDuration.toString()} onChange={(value: string) => handleSessionDurationChange(value)}

                                        getLabel={(status) => status.label.toString()}
                                        getValue={(status) => status.value.toString()} />
                                </div>
                                <div className={`flex-1 ${hasBookedSelectDay ? 'pointer-events-none opacity-50' : ''}`}>
                                    <p className="text-sm text-muted-foreground ml-2 mb-1">Buffer time between sessions</p>
                                    <CustomSelect
                                        options={bufferOptions.map((buffer) => buffer)}
                                        value={bufferTime.toString()} onChange={(value: string) => handleBufferTimeChange(value)}
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

                            return (
                                <button
                                    disabled={(convertTimeToString(selectedDay) === convertTimeToString(now) && slot.startTime < currentTime) || convertTimeToString(selectedDay) < convertTimeToString(now)}
                                    key={index}
                                    onClick={() => handleTimeSlotClick(slot)}
                                    className={`flex justify-center items-center w-1/5 rounded-lg px-1 py-4 m-2 ${!isBooked ? 'cursor-pointer' : ''} ${isSelected
                                        ? "bg-primary"
                                        : "bg-muted hover:bg-muted-foreground"
                                        } ${isBooked ? '!bg-info' : ''} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-muted`}
                                >
                                    <p>{slot.startTime} - {slot.endTime}</p>
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
                                {startTime} - {endTime}
                                <span className="mx-2">•</span>
                                <span className="font-medium text-foreground">Session:</span>{" "}
                                {sessionDurationOptions.find((x) => x.value === sessionDuration)?.label}
                                <span className="mx-2">•</span>
                                <span className="font-medium text-foreground">Buffer:</span>{" "}
                                {bufferOptions.find((x) => x.value === bufferTime)?.label}
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