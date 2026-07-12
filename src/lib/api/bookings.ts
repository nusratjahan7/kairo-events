import { protectedFetch } from "../core/server";

interface Booking {
    id: string;
    eventId?: string;
    customerName: string;
    customerEmail: string;
    eventName: string;
    eventDate: string;
    ticketsCount: number;
    totalPrice: number;
    status: "confirmed" | "pending" | "cancelled";
    bookedAt: string;
    stripeSessionId?: string;
}

export const getBookings = async (): Promise<Booking[]> => {
    return protectedFetch("/api/admin/bookings");
};

export const getMyBookings = async (email: string): Promise<Booking[]> => {
    return protectedFetch(`/api/bookings/mine?email=${encodeURIComponent(email)}`);
};