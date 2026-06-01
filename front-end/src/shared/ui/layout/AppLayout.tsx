import { useSelector } from "react-redux";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { Toaster } from "sonner";
import { URL_ROUTES } from "../../../configs/url_routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faGauge, faUser } from "@fortawesome/free-solid-svg-icons";

export const AppLayout = () => {
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const role = currentUser?.roleName;

    const navigate = useNavigate();
    const location = useLocation();

    const navigateItems = [
        { name: 'Dashboard', icon: <FontAwesomeIcon className="mr-2" icon={faGauge} />, path: '/dashboard' },
        { name: 'My Courses', icon: <FontAwesomeIcon className="mr-2" icon={faBook} />, path: URL_ROUTES.MENTOR_COURSE, roles: ['Mentor'] },
        { name: 'Find Courses', icon: <FontAwesomeIcon className="mr-2" icon={faBook} />, path: URL_ROUTES.TRAINEE_COURSES, roles: ['Trainee', 'Admin'] },
        { name: 'All Courses', icon: <FontAwesomeIcon className="mr-2" icon={faBook} />, path: URL_ROUTES.All_COURSES, roles: ['Admin'] },
        { name: 'Profile', icon: <FontAwesomeIcon className="mr-2" icon={faUser} />, path: URL_ROUTES.PROFILE },
    ]

    const visibleItems = navigateItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(role || "");
    });

    return (
        <div className="flex">
            <Toaster position="top-right" richColors />

            {/* Sidebar */}
            <div className="w-[20%] min-h-screen bg-card p-4 text-white text-center">
                <nav>
                    <header className="mb-4">
                        <h1 className="text-2xl font-bold text-primary">
                            Learning Hub
                        </h1>
                    </header>

                    {/* full width hr */}
                    <hr className="border-gray-600 -mx-4 mb-4" />

                    <ul className="space-y-2">
                        {visibleItems.map((item) => {
                            const isActive = matchPath(item.path, location.pathname);
                            return (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path === '/profile/:id' ? `/profile/${currentUser?.id}` : item.path)}
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
                </nav>
            </div>

            {/* Main content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}