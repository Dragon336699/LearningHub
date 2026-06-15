import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchAllUsersForAdmin } from "../../../store/thunks/userThunks";
import { userService } from "../../../services/user.service";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../shared/ui/components/Pagination";
import { ConfirmModal } from "../../../shared/ui/components/ConfirmModal";
import { toast } from "sonner";
import { Result } from "../../../shared/types/result";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleXmark, faExclamationCircle, faEye, faSearch, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { CommonPageSizeOptions } from "../../../shared/types/pageSizeOptions";

export const UserManagementPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const rawUsers = useAppSelector((state) => state.user.adminUserList);
  const loading = useAppSelector((state) => state.user.loading);

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [uiFeedback, setUiFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [actionUser, setActionUser] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPage = Math.ceil(rawUsers.totalCount / pageSize);

  useEffect(() => {
    dispatch(fetchAllUsersForAdmin({ page: page, pageSize: pageSize, keyword: keyword }));
  }, [dispatch, page, keyword]);

  useEffect(() => {
    if (!uiFeedback) return;
    const t = setTimeout(() => setUiFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [uiFeedback]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setKeyword(keywordInput);
    }, 200);

    return () => clearTimeout(handler);
  }, [keywordInput]);

  const handleToggleStatus = async () => {
    const rawStatus = String(actionUser?.status).toLowerCase();
    const isActive = rawStatus === "active" || rawStatus === "0";
    const targetStatusNumber = isActive ? 1 : 0;
    const actionText = isActive ? "deactivate" : "activate";

    try {
      await userService.changeUserStatus(actionUser?.id ?? "", targetStatusNumber);
      dispatch(fetchAllUsersForAdmin({ page: page, pageSize: pageSize }));
      setIsConfirmModalOpen(false);
      toast.success(`Successfully ${actionText}d user account.`)
    } catch (err: Result<any> | any) {
      if (err) {
        err.forEach((error: string) => toast.error(error));
        return;
      }

      toast.error("Failed to update user status.");
    }
  };

  const handleChangePageSize = (newPageSize: number) => {
    const firstItemIndex = (page - 1) * pageSize + 1;
    const newPage = Math.ceil(firstItemIndex / newPageSize);
    setPage(newPage);
    setPageSize(newPageSize);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6 space-y-6 animate-in fade-in duration-300">

      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">User Role Management</h2>
        <p className="text-xs text-gray-500 mt-1">Platform operational status control panel.</p>
      </div>

      {uiFeedback && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${uiFeedback.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>

          <FontAwesomeIcon icon={faExclamationCircle} className={`w-4 h-4 ${uiFeedback.type === "success" ? "text-emerald-400" : "text-red-400"}`} />
          <span>{uiFeedback.msg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-200 placeholder-gray-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500/50 transition-all"
          />
        </div>
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
              {rawUsers.items.map((u) => {
                const rawStatus = String(u.status).toLowerCase();
                const isActive = rawStatus === "active" || rawStatus === "0";
                const userFullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();

                return (
                  <tr key={u.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{userFullName}</td>
                    {/* <td className="p-4 text-gray-400 text-xs">{u.email || "N/A"}</td> */}
                    <td className="p-4">
                      <span className="bg-gray-900 border border-gray-700 text-gray-300 text-[11px] px-2.5 py-1 rounded-lg font-medium uppercase">
                        {u.roleName || "Learner"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-0.5 text-[11px] font-bold rounded-full select-none ${isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                        {isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          title="View Profile"
                          type="button"
                          onClick={() => navigate(`/profile/${u.id}`)}
                          className="text-gray-500 hover:text-orange-400 p-1"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>

                        {isActive ? (
                          <button
                            type="button"
                            title="Deactivate Account"
                            onClick={() => {
                              setActionUser({ id: u.id, status: u.status });
                              setIsConfirmModalOpen(true);
                            }}
                            className="text-gray-500 hover:text-red-500 transition p-1"
                          >
                            <FontAwesomeIcon icon={faCircleXmark} className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Activate Account"
                            onClick={() => {
                              setActionUser({ id: u.id, status: u.status });
                              setIsConfirmModalOpen(true);
                            }}
                            className="text-gray-500 hover:text-emerald-500 transition p-1"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
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

        {!loading && rawUsers.totalCount === 0 && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <FontAwesomeIcon icon={faUserSlash} className="h-8 w-8 text-gray-600" />
            <p className="italic text-xs">No matching user records found.</p>
          </div>
        )}

        {isConfirmModalOpen && (
          <ConfirmModal
            title="Are you sure you want to change user status"
            description={`Do you want to change user status to ${actionUser?.status.toLowerCase() === 'active' ? "Deactivated" : "Activated"}?`}
            isLoading={loading}
            onConfirm={() => handleToggleStatus()}
            onCancel={() => {
              setIsConfirmModalOpen(false);
            }}
          />
        )}
      </div>
      {totalPage > 0 && <div className="mt-4 mb-4">
        <Pagination
          onPageSizeChange={handleChangePageSize}
          pageSizeOptions={CommonPageSizeOptions.map(pageSize => ({ label: pageSize, value: pageSize }))}
          currentPageSize={pageSize}
          currentPage={page}
          totalPages={totalPage}
          onPageChange={setPage}
        />
      </div>}

    </div>
  );
};