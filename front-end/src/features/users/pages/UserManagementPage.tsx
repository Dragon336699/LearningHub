import React, { useEffect, useState, useMemo } from "react";
import { Search, CheckCircle, XCircle, UserX, AlertCircle, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchAllUsersForAdmin } from "../../../store/thunks/userThunks";
import { userService } from "../../../services/user.service";
import { useNavigate } from "react-router-dom";

export const UserManagementPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const rawUsers = useAppSelector((state) => state.user.adminUserList);
  const loading = useAppSelector((state) => state.user.loading);

  const [keyword, setKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [uiFeedback, setUiFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    dispatch(fetchAllUsersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!uiFeedback) return;
    const t = setTimeout(() => setUiFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [uiFeedback]);

  const handleToggleStatus = async (userId: string, currentStatus: any) => {
    const rawStatus = String(currentStatus).toLowerCase();
    const isActive = rawStatus === "active" || rawStatus === "0";
    const targetStatusNumber = isActive ? 1 : 0; 
    const actionText = isActive ? "deactivate" : "activate";

    if (!globalThis.confirm(`Are you sure you want to ${actionText} this user account?`)) return;

    try {
      setUiFeedback(null);
      await userService.changeUserStatus(userId, targetStatusNumber);
      dispatch(fetchAllUsersForAdmin());
      setUiFeedback({ type: "success", msg: `Successfully ${actionText}d user account.` });
    } catch (err: any) {
      setUiFeedback({ type: "error", msg: "Failed to update user status due to security or connection issue." });
    }
  };

  const filteredUsers = useMemo(() => {
    return rawUsers.filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      //const email = (u.email || "").toLowerCase();
      const searchLower = keyword.toLowerCase();

      const matchesKeyword = fullName.includes(searchLower);
      const matchesRole = selectedRole === "All Roles" || String(u.roleName).toLowerCase() === selectedRole.toLowerCase();

      return matchesKeyword && matchesRole;
    });
  }, [rawUsers, keyword, selectedRole]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6 space-y-6 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">User Role Management</h2>
        <p className="text-xs text-gray-500 mt-1">Monitor, activate, and deactivate users accounts across the platform.</p>
      </div>

      {uiFeedback && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
          uiFeedback.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          <AlertCircle className="h-4 w-4" />
          <span>{uiFeedback.msg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-950/20 p-1">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-200 placeholder-gray-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500/50 transition-all"
          />
        </div>

        <select
          title="Filter by Role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-orange-500/50 cursor-pointer w-full sm:w-auto"
        >
          <option>All Roles</option>
          <option>Mentor</option>
          <option>Trainee</option>
        </select>
      </div>

      {/* User table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/40 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Full Name</th>
                {/* <th className="p-4">Email</th> */}
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60 text-sm">
              {filteredUsers.map((u) => {
                const rawStatus = String(u.status).toLowerCase();
                const isActive = rawStatus === "active" || rawStatus === "0";
                const userFullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();

                return (
                  <tr key={u.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      {userFullName}
                    </td>
                    {/* <td className="p-4 text-gray-400 text-xs">{u.email || "N/A"}</td> */}
                    <td className="p-4">
                      <span className="bg-gray-900 border border-gray-700 text-gray-300 text-[11px] px-2.5 py-1 rounded-lg font-medium uppercase">
                        {u.roleName || "Trainee"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-0.5 text-[11px] font-bold rounded-full select-none ${
                        isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          title="View User Profile Details"
                          onClick={() => navigate(`/profile/${u.id}`)}
                          className="text-gray-500 hover:text-orange-400 hover:scale-110 transition p-1.5 focus:outline-none"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>

                        {isActive ? (
                          <button
                            type="button"
                            title="Deactivate Account"
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className="text-gray-500 hover:text-red-500 transition p-1"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Activate Account"
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className="text-gray-500 hover:text-emerald-500 transition p-1"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Giao diện danh sách trống */}
        {!loading && filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <UserX className="h-8 w-8 text-gray-600" />
            <p className="italic text-xs">No matching user records found in the network database.</p>
          </div>
        )}
      </div>
    </div>
  );
};