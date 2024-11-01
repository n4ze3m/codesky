import { SESSION_LOCAL_STORAGE_KEY } from "../lib/api";

export const isAuthenticated = () => {
    const token = !!localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);
    return !!token;
};