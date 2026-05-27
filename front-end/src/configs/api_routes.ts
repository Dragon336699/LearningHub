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
  },
  COURSE: {
    GET_LIST: "/courses",
    GET_DETAIL: (id: string) => `/courses/${id}`, 
  }
};