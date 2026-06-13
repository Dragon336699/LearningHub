import React, { useEffect, useState } from "react";
import { X, Calendar as CalendarIcon, Clock, MessageSquare, AlertCircle, MapPin } from "lucide-react";
import { useAppDispatch } from "../../../store/hooks";
import { AvailableSlotsResponse } from "../../../types/session";
import { createBookingSession, fetchAvailableSlots } from "../../../store/thunks/sessionThunk";
import { toast } from "sonner";

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
}

const getLocalDateString = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

export const BookSessionModal: React.FC<BookSessionModalProps> = ({ isOpen, onClose, mentorId }) => {
  const dispatch = useAppDispatch();
  const todayStr = getLocalDateString();
  
  const [date, setDate] = useState<string>(todayStr);
  const [durationType, setDurationType] = useState<number | "">("");
  const [sessionType, setSessionType] = useState<number | "">(1);  
  const [topic, setTopic] = useState<string>("");
  
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotsResponse[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | "">("");
  
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDate(todayStr);
      setDurationType("");
      setSessionType(1);
      setTopic("");
      setSelectedSlotIndex("");
      setErrorMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date || durationType === "") {
        setAvailableSlots([]);
        setSelectedSlotIndex("");
        return;
      }
      
      setIsLoadingSlots(true);
      setErrorMsg(null);
      try {
        const result = await dispatch(fetchAvailableSlots({
          mentorId,
          date,
          durationType: Number(durationType)
        })).unwrap();
        if(result.length > 0) {
          setAvailableSlots(result);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        setAvailableSlots([]);
        setErrorMsg("Failed to load available slots.");
      } finally {
        setIsLoadingSlots(false);
        setSelectedSlotIndex("");
      }
    };

    if (isOpen) {
      fetchSlots();
    }
  }, [date, durationType, mentorId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlotIndex === "" || durationType === "") return;

    const slot = availableSlots[Number(selectedSlotIndex)];
    
    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      await dispatch(createBookingSession({
        mentorId,
        sessionType: Number(sessionType),
        topic,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })).unwrap();
      
      toast.success("Booking session created successfully!");
      onClose();
    } catch (err: any) {
      setErrorMsg(err || "Failed to book session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">

        <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gray-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            Book a Session
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Date</label>
              <input
                type="date"
                required
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Duration Type</label>
              <select
                required
                value={durationType}
                onChange={(e) => setDurationType(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              >
                <option value="" disabled>Select duration type...</option>
                <option value={1}>15 Minutes</option>
                <option value={2}>30 Minutes</option>
                <option value={3}>45 Minutes</option>
                <option value={4}>1 Hour</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Available Slots
            </label>
            <select
              required
              disabled={availableSlots.length === 0 || isLoadingSlots}
              value={selectedSlotIndex}
              onChange={(e) => setSelectedSlotIndex(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <option value="" disabled>
                {isLoadingSlots 
                  ? "Loading slots..." 
                  : availableSlots.length === 0 
                    ? "No slots available for this configuration" 
                    : "Choose a time slot..."}
              </option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={index}>
                  {slot.displayText}
                </option>
              ))}
            </select>
            {/* {availableSlots.length === 0 && date && durationType !== "" && !isLoadingSlots && (
              <p className="text-xs text-red-400 mt-1">No slots available.</p>
            )} */}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Session Type
            </label>
            <select
              required
              value={sessionType}
              onChange={(e) => setSessionType(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            >
              <option value="" disabled>Select session type...</option>
              <option value={1}>Virtual</option>
              <option value={2}>Direct</option>
            </select>
          </div>

          <div className="space-y-1.5">
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
      <MessageSquare className="h-4 w-4" /> What would you like to discuss?
    </label>
    <span className="text-xs text-gray-400">
      {topic.length}/100
    </span>
  </div>
  
  <textarea
    rows={3}
    maxLength={100} 
    value={topic}
    onChange={(e) => setTopic(e.target.value)}
    placeholder="E.g., I want to review my CV and practice system design interview..."
    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
  />
</div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableSlots.length === 0 || selectedSlotIndex === "" || sessionType === ""}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Confirming...
                </>
              ) : (
                "Confirm Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};