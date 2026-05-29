export const API_ROUTES = {
  USER: {
    PROFILE: "/user/profile",
    GET_ALL: "/users",
    UPDATE: "/user/profile",
  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN:"/auth/refresh-token",
    VERIFY_EMAIL:"/auth/verify-email",
    RESEND_VERIFY:"/auth/resend-verification-email"
  },
  ROLES:{
    ALL:"/role"
  },
  COURSE: {
    GET_LIST: "/courses",
    GET_DETAIL: (id: string) => `/courses/${id}`, 
  }
};