import { useSelector } from "react-redux";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { Toaster } from "sonner";
import { URL_ROUTES } from "../../../configs/url_routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faGauge, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logoutUser } from "../../../store/thunks/authThunks";

export const AppLayout = () => {
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const role = currentUser?.roleName;

    const [isConfirmDialogLogout, setIsConfirmDialogLogout] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);

    const navigateItems = [
        { name: 'Dashboard', icon: <FontAwesomeIcon className="mr-2" icon={faGauge} />, path: '' },
        { name: 'My Courses', icon: <FontAwesomeIcon className="mr-2" icon={faBook} />, path: URL_ROUTES.MENTOR_COURSE, roles: ['Mentor'] },
        { name: 'Find Courses', icon: <FontAwesomeIcon className="mr-2" icon={faBook} />, path: URL_ROUTES.TRAINEE_COURSES, roles: ['Trainee'] },
        { name: 'All Courses', icon: <FontAwesomeIcon className="mr-2" icon={faBook} />, path: URL_ROUTES.All_COURSES, roles: ['Admin'] },
        { name: 'Profile', icon: <FontAwesomeIcon className="mr-2" icon={faUser} />, path: URL_ROUTES.PROFILE },
    ]

    const visibleItems = navigateItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(role || "");
    });

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate(URL_ROUTES.LOGIN);
    }

    return (
        <div className="flex h-screen">
            <Toaster position="top-right" richColors />

            {/* Sidebar */}
            <div className="w-[20%] bg-card p-4 text-white text-center flex flex-col h-full">
                <nav className="flex flex-col h-full">
                    <header className="mb-4">
                        <h1
                            onClick={() => navigate('/')}
                            className="cursor-pointer text-2xl font-bold text-primary"
                        >
                            Learning Hub
                        </h1>
                    </header>

                    <hr className="border-gray-600 -mx-4 mb-4" />

                    {/* MENU */}
                    <ul className="space-y-2 flex-1 overflow-y-auto">
                        {visibleItems.map((item) => {
                            const isActive = matchPath(item.path, location.pathname);

                            return (
                                <li key={item.path}>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                item.path === '/profile/:id'
                                                    ? `/profile/${currentUser?.id}`
                                                    : item.path
                                            )
                                        }
                                        className={`w-full rounded-lg px-4 py-3 text-left transition
                                    ${isActive
                                                ? "bg-primary text-white"
                                                : "hover:bg-sidebar-hover"
                                            }
                                `}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* LOGOUT (fixed bottom) */}
                    <button
                        className="mt-auto w-full cursor-pointer rounded-lg px-4 py-3 text-left transition hover:bg-danger-hover"
                        onClick={() => setIsConfirmDialogLogout(true)}
                    >
                        <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>

            {/* Modal */}
            {isConfirmDialogLogout && (
                <ConfirmModal
                    isLoading={loading}
                    onConfirm={() => handleLogout()}
                    onCancel={() => setIsConfirmDialogLogout(false)}
                    title="Confirm Logout"
                    description="Are you sure you want to log out?"
                />
            )}
        </div>
    );
}