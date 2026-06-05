import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { SessionResponse } from "../../../types/session";
import {
  approveSession,
  cancelSession,
  fetchUserSessions,
} from "../../../store/thunks/sessionThunk";
import { DialogShell } from "../../../shared/ui/components/DialogShell";
import { toast } from "sonner";

export const SessionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDateToLocal = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  //calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const emptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  useEffect(() => {
    if (!currentUser?.id) return;

    const loadSessions = async () => {
      setIsLoading(true);
      const dateString = formatDateToLocal(selectedDate);
      try {
        const result = await dispatch(
          fetchUserSessions({ userId: currentUser.id, date: dateString }),
        ).unwrap();
        console.log("Fetched sessions:", result);
        setSessions(result || []);
      } catch (error) {
        console.error("Failed to load sessions:", error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [selectedDate, currentUser, dispatch]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const newSelectedDate = new Date(year, month, day);
    setSelectedDate(newSelectedDate);
  };

  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: "approve" | "cancel" | null;
    sessionId: string | null;
  }>({
    isOpen: false,
    type: null,
    sessionId: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveClick = (sessionId: string) => {
    setDialogConfig({ isOpen: true, type: "approve", sessionId });
  };

  const handleCancelClick = (sessionId: string) => {
    console.log("Cancel session with ID:", sessionId);
    setDialogConfig({ isOpen: true, type: "cancel", sessionId });
  };

  const closeDialog = () => {
    setDialogConfig({ isOpen: false, type: null, sessionId: null });
  };

  const handleConfirmAction = async () => {
    const { type, sessionId } = dialogConfig;
    if (!sessionId || !type) return;

    setIsProcessing(true);
    try {
      if (type === "approve") {
        await dispatch(approveSession(sessionId)).unwrap();
        toast.success("Session approved successfully!");
      } else {
        await dispatch(cancelSession(sessionId)).unwrap();
        toast.success("Session cancelled successfully!");
      }

      // Refresh lại danh sách session
      dispatch(
        fetchUserSessions({
          userId: currentUser!.id,
          date: formatDateToLocal(selectedDate),
        }),
      )
        .unwrap()
        .then(setSessions);

      closeDialog();
    } catch (error: any) {
      toast.error(error || `Failed to ${type} session`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      {/* KHU VỰC LỊCH */}
      <div className="mb-8 p-6 bg-gray-800 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-gray-400 hover:text-white px-2 py-1"
          >
            &lt;
          </button>
          <h4 className="font-medium text-lg">
            {currentDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h4>
          <button
            onClick={handleNextMonth}
            className="text-gray-400 hover:text-white px-2 py-1"
          >
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <div key={d} className="text-xs text-gray-400 py-1 font-semibold">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: emptyDays }).map((_, index) => (
            <button
              key={`empty-${index}`}
              className="py-2 rounded-full text-sm text-gray-600 cursor-default"
              disabled
            ></button>
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isSelected =
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            return (
              <button
                key={day}
                onClick={() => handleSelectDate(day)}
                className={`py-2 rounded-full text-sm transition-colors ${
                  isSelected
                    ? "bg-orange-500 text-white font-bold"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
          Sessions for {formatDateToLocal(selectedDate)}
        </h3>

        {isLoading ? (
          <p className="text-gray-400 text-center py-8">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-400 text-center py-8 bg-gray-800 rounded-lg">
            No sessions scheduled for this date.
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h4 className="font-bold text-lg text-orange-400">
                    {session.topic || ""}
                  </h4>
                  <div className="text-sm text-gray-300 mt-1 space-y-1">
                    <p>
                      <span className="font-medium text-gray-500">Time: </span>
                      {new Date(session.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {new Date(session.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">
                        Mentor:{" "}
                      </span>{" "}
                      {session.mentorName}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">
                        Trainee:{" "}
                      </span>{" "}
                      {session.traineeName}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">Type: </span>{" "}
                      {session.sessionType}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">
                        Status:{" "}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-1 ${
                          session.sessionStatus === "Pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : session.sessionStatus === "Approved"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {session.sessionStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {session.sessionStatus === "Pending" && (
                  <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                    {currentUser?.roleName === "Trainee" && (
                      <button
                        onClick={() => handleCancelClick(session.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition"
                      >
                        Cancel
                      </button>
                    )}

                    {currentUser?.roleName === "Mentor" && (
                      <>
                        <button
                          onClick={() => handleApproveClick(session.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm font-medium transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleCancelClick(session.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <DialogShell
        open={dialogConfig.isOpen}
        isLoading={isProcessing}
        title={dialogConfig.type === "approve" ? "Approve Session" : "Cancel Session"}
        onClose={closeDialog}
      >
        <div className="space-y-4">
            Are you sure you want to {dialogConfig.type} this session? 
            {dialogConfig.type === "cancel" && " This action cannot be undone."}
          
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={closeDialog}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              No, keep it
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={isProcessing}
              className={`px-6 py-2 text-white rounded-md text-sm font-medium transition-colors ${
                dialogConfig.type === "approve" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Yes, {dialogConfig.type}
            </button>
          </div>
        </div>
      </DialogShell>
    </div>
  );
};
