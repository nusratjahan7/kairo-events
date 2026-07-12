import { protectedFetch } from "../core/server";

export const getBookings = async () => {
    return protectedFetch("/api/admin/bookings");
};