import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchDailyQuote, fetchDashboardSummary } from "../../../store/thunks/dashboardThunks";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { useAppSelector } from "../../../store/hooks";
import { fetchUserSessions } from "../../../store/thunks/sessionThunk";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { summaries, loading } = useSelector(
    (state: RootState) => state.dashboard,
  );

  const { sessions } = useAppSelector((state: RootState) => state.session);
  const {quote} =  useAppSelector((state: RootState) => state.dashboard);

  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const currentUserRole = String(
    currentUser?.roleName || (currentUser as any)?.RoleName || "",
  ).toLowerCase();
  const currentIsAdmin = currentUserRole === "admin";
  const currentIsMentor = currentUserRole === "mentor";
  const currentIsTrainee = currentUserRole === "trainee";

  const [timeRange, setTimeRange] = useState<string>("week");

  useEffect(() => {
    const today = new Date();
    const fromDateObj = new Date(today);

    switch (timeRange) {
      case "today":
        break;
      case "week":
        fromDateObj.setDate(today.getDate() - 6);
        break;
      case "month":
        fromDateObj.setMonth(today.getMonth() - 1);
        break;
      case "6months":
        fromDateObj.setMonth(today.getMonth() - 6);
        break;
      case "year":
        fromDateObj.setMonth(today.getMonth() - 12);
        break;
      default:
        fromDateObj.setDate(today.getDate() - 6);
    }

    const toDate = today.toISOString().split("T")[0];
    const fromDate = fromDateObj.toISOString().split("T")[0];

    const fetchParams = { FromDate: fromDate, ToDate: toDate };

    switch (currentUserRole) {
      case "admin":
        dispatch(fetchDashboardSummary(fetchParams));
        break;

      case "mentor":
      case "trainee":
        dispatch(
          fetchUserSessions({
            date: toDate,
            sessionStatus: "Approved",
          }),
        );
        break;

      default:
        console.warn(`Unknown role or role not loaded yet: ${currentUserRole}`);
        break;
    }
    dispatch(fetchDailyQuote());
  }, [dispatch, timeRange, currentUserRole]);

  const { currentMetrics, trends } = useMemo(() => {
    const defaultMetrics = { totalUser: 0, totalSession: 0, totalResource: 0 };
    const defaultTrends: {
      user: string | null;
      session: string | null;
      resource: string | null;
    } = {
      user: null,
      session: null,
      resource: null,
    };

    if (!summaries || summaries.length === 0) {
      return { currentMetrics: defaultMetrics, trends: defaultTrends };
    }

    const current = summaries[summaries.length - 1];
    let calculatedTrends = { ...defaultTrends };

    if (summaries.length > 1) {
      const previous = summaries[summaries.length - 2];
      const calcPercent = (curr: number, prev: number) => {
        if (prev === 0) return curr > 0 ? "100" : "0";
        return (((curr - prev) / prev) * 100).toFixed(1);
      };

      calculatedTrends.user = calcPercent(
        current.totalUser,
        previous.totalUser,
      );
      calculatedTrends.resource = calcPercent(
        current.totalResource,
        previous.totalResource,
      );
      calculatedTrends.session = calcPercent(
        current.totalSession,
        previous.totalSession,
      );
    }

    return { currentMetrics: current, trends: calculatedTrends };
  }, [summaries]);

  const upcomingSessions = useMemo(() => {
    if (!sessions || !Array.isArray(sessions)) return [];

    const now = new Date();

    return (
      [...sessions]
        .filter((session) => new Date(session.startTime) >= now)
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        )
        .slice(0, 3)
    );
  }, [sessions]);

  const renderTrend = (percentValue: string | null) => {
    if (percentValue === null) return null;
    const isPositive = parseFloat(percentValue) >= 0;
    return (
      <span
        className={`text-xs font-semibold px-2 py-1 rounded bg-zinc-800 ${isPositive ? "text-green-400 border border-green-500/20" : "text-red-400 border border-red-500/20"}`}
      >
        {isPositive ? "↑ +" : "↓ "}
        {percentValue}%
      </span>
    );
  };

  const mockCompletionData = [
    { value: 60 },
    { value: 62 },
    { value: 61 },
    { value: 65 },
    { value: 64 },
    { value: 67.8 },
  ];

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="w-full p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Dashboard</h1>

          <div className="relative">
            {currentIsAdmin && (
              <>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full sm:w-40 bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 cursor-pointer transition-all pr-10 shadow-inner"
                >
                  <option value="today">Today</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="6months">Half-yearly</option>
                  <option value="year">Yearly</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950">
            <span className="text-xl font-medium tracking-wide text-zinc-500 animate-pulse">
              Loading...
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {currentIsAdmin && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Users */}
                  <div className="bg-zinc-950/40 rounded-xl p-5 border border-zinc-800/80 flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="flex items-center text-orange-500 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">Total Users</h2>
                    </div>
                    <div className="h-12 w-full opacity-60 px-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={summaries}>
                          <Line type="monotone" dataKey="totalUser" stroke="#60a5fa" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-end z-10">
                      <p className="text-4xl font-bold tracking-tight text-white">{currentMetrics.totalUser}</p>
                      <div className="mb-1">{renderTrend(trends.user)}</div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="bg-zinc-950/40 rounded-xl p-5 border border-zinc-800/80 flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="flex items-center text-orange-500 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253" />
                      </svg>
                      <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">Resources</h2>
                    </div>
                    <div className="h-12 w-full opacity-60 px-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={summaries}>
                          <Line type="monotone" dataKey="totalResource" stroke="#34d399" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-end z-10">
                      <p className="text-4xl font-bold tracking-tight text-white">{currentMetrics.totalResource}</p>
                      <div className="mb-1">{renderTrend(trends.resource)}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sessions */}
                  <div className="bg-zinc-950/40 rounded-xl p-5 border border-zinc-800/80 flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="flex items-center text-orange-500 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">Sessions</h2>
                    </div>
                    <div className="h-12 w-full opacity-60 px-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={summaries}>
                          <Line type="monotone" dataKey="totalSession" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-end z-10">
                      <p className="text-4xl font-bold tracking-tight text-white">{currentMetrics.totalSession}</p>
                      <div className="mb-1">{renderTrend(trends.session)}</div>
                    </div>
                  </div>

                  <div className="bg-zinc-950/40 rounded-xl p-5 border border-zinc-800/80 flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="flex items-center text-orange-500 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h3.28a1 1 0 01.948.684l.894 2.682A2 2 0 0011.92 10h6.12a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                      <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">Program Completion Rate</h2>
                    </div>
                    <div className="h-12 w-full opacity-60 px-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockCompletionData}>
                          <Line type="monotone" dataKey="value" stroke="#fb7185" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-end z-10">
                      <p className="text-4xl font-bold tracking-tight text-white">67.8%</p>
                      <div className="mb-1">{renderTrend("3.2")}</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentIsMentor && (
              <div className="bg-zinc-950/40 rounded-xl p-6 border border-zinc-800/80">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Upcoming Sessions
                </h2>

                {upcomingSessions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                      <thead className="text-xs uppercase bg-zinc-900 text-zinc-500 border-b border-zinc-800">
                        <tr>
                          <th className="px-4 py-3 font-medium rounded-tl-lg">Trainee</th>
                          <th className="px-4 py-3 font-medium">Date & Time</th>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {upcomingSessions.map((session) => {
                          const start = new Date(session.startTime);
                          const end = new Date(session.endTime);
                          const dateStr = start.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
                          const timeStr = `${start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;

                          return (
                            <tr key={session.id} className="hover:bg-zinc-800/20 transition-colors">
                              <td className="px-4 py-4">
                                <div className="font-medium text-zinc-200">{session.traineeName?.trim() || "N/A"}</div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-zinc-300 mb-0.5">{dateStr}</div>
                                <div className="text-xs text-zinc-500">{timeStr}</div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{session.sessionType}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">{session.sessionStatus}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-zinc-500 bg-zinc-900/30 rounded-lg border border-dashed border-zinc-800">
                    <p>No upcoming session.</p>
                  </div>
                )}
                <div className="mt-5 flex justify-end border-t border-zinc-800/60 pt-4">
                  <button onClick={() => navigate("/sessions")} className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors group cursor-pointer">
                    View All Sessions
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {currentIsTrainee && (
              <div className="space-y-6">
                <div className="bg-zinc-950/40 rounded-xl p-6 border border-zinc-800/80">
                  <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Upcoming Sessions
                  </h2>

                  {upcomingSessions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="text-xs uppercase bg-zinc-900 text-zinc-500 border-b border-zinc-800">
                          <tr>
                            <th className="px-4 py-3 font-medium rounded-tl-lg">Mentor</th>
                            <th className="px-4 py-3 font-medium">Date & Time</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {upcomingSessions.map((session) => {
                            const start = new Date(session.startTime);
                            const end = new Date(session.endTime);
                            const dateStr = start.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
                            const timeStr = `${start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;

                            return (
                              <tr key={session.id} className="hover:bg-zinc-800/20 transition-colors">
                                <td className="px-4 py-4">
                                  <div className="font-medium text-zinc-200">{session.mentorName?.trim() || "N/A"}</div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-zinc-300 mb-0.5">{dateStr}</div>
                                  <div className="text-xs text-zinc-500">{timeStr}</div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{session.sessionType}</span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">{session.sessionStatus}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-zinc-500 bg-zinc-900/30 rounded-lg border border-dashed border-zinc-800">
                      <p>No upcoming session.</p>
                    </div>
                  )}

                  <div className="mt-5 flex justify-end border-t border-zinc-800/60 pt-4">
                    <button onClick={() => navigate("/sessions")} className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors group cursor-pointer">
                      View All Sessions
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950/40 rounded-xl p-6 border border-zinc-800/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h2 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">Program Completion Rate</h2>
                    </div>
                    <span className="text-2xl font-bold text-white">74.5%</span>
                  </div>

                  <div className="w-full bg-zinc-900 rounded-full h-3 border border-zinc-800 overflow-hidden">
                    <div className="bg-linear-to-r from-orange-600 to-orange-400 h-full rounded-full transition-all duration-500" style={{ width: "74.5%" }} />
                  </div>

                  <div className="flex justify-between items-center mt-3 text-xs text-zinc-500">
                    <span>Mocked Data</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <div className="bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 relative overflow-hidden text-white shadow-md">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-2.424 1.22-3.8 3.01-3.824 5.312 1.05-.13 2.085.245 2.774 1.011.758.843.838 2.083.243 3.003-.594.92-1.656 1.354-2.59.924-.716-.33-1.303-.941-1.943-1.631zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-2.424 1.22-3.8 3.01-3.824 5.312 1.05-.13 2.085.245 2.774 1.011.758.843.838 2.083.243 3.003-.594.92-1.656 1.354-2.59.924-.716-.33-1.303-.941-1.943-1.631z"/>
          </svg>
          Quotes of the day
        </h2>
        
        <div className="border-l-2 border-orange-500/70 pl-4 py-1 relative z-10">
          <p className="text-lg font-medium text-zinc-100 italic tracking-wide">
            {quote?.q}
          </p>
          <p className="text-base text-zinc-400 mt-2 italic font-light tracking-wide">
            {quote?.a}
          </p>
        </div>

        <div className="absolute -bottom-4 -right-4 text-zinc-800/10 pointer-events-none select-none z-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-2.424 1.22-3.8 3.01-3.824 5.312 1.05-.13 2.085.245 2.774 1.011.758.843.838 2.083.243 3.003-.594.92-1.656 1.354-2.59.924-.716-.33-1.303-.941-1.943-1.631zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-2.424 1.22-3.8 3.01-3.824 5.312 1.05-.13 2.085.245 2.774 1.011.758.843.838 2.083.243 3.003-.594.92-1.656 1.354-2.59.924-.716-.33-1.303-.941-1.943-1.631z"/>
          </svg>
        </div>
      </div>

    </div>
  );
};