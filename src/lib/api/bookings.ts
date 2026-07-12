import { protectedFetch } from "../core/server";

export const getBookings = async () => {
    return protectedFetch("/api/admin/bookings");
};

export const getMyBookings = async (email: string) => {
    return protectedFetch(`/api/bookings/mine?email=${encodeURIComponent(email)}`);
};