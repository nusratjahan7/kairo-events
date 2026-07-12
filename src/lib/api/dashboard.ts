import { protectedFetch } from "../core/server";

export const getDashboard = async () => {
    return protectedFetch('/api/admin/dashboard');
}