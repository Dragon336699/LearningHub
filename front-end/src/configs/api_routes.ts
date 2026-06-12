export const API_ROUTES = {
  USER: {
    PROFILE: "/user/profile",
    ADMIN_GET_ALL: "/user/admin/users",
    UPDATE: "/user/profile",
    EXPERTISE: "/expertise",
  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFY: "/auth/resend-verification-email",
  },
  ROLES: {
    ALL: "/role",
  },
  COURSE: {
    COMMON: "/courses",
    CHANGE_STATUS: "/courses/status",
    MENTOR: "/courses/mentor",
    TRAINEE: "/courses/published",
    GET_DETAIL: (id: string) => `/courses/${id}`,
  },
  AVAILABILITY: {
    COMMON: "/availability",
  },
  RESOURCE: {
    COMMON: "/resource",
    MENTOR: "/resource/mentor"
  },
  SESSIONS: {
    DEFAULT: "/sessions",
    AVAILABLE_SLOTS: "/sessions/available-slots",
    APPROVE: "/sessions/approve",
    CANCEL: "/sessions/cancel",
  },
  DASHBOARD:{
    SUMMARY: "/dashboards",
    DAILY_QUOTE: "/dashboards/daily-quotes"
  }
};
