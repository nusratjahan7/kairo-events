import { serverMutation } from "../core/server";

export const updateBookingStatus = async (id: string, status: string) => {
    return serverMutation(`/api/admin/bookings/${id}`, { status }, "PUT");
};

export const deleteBooking = async (id: string) => {
    return serverMutation(`/api/admin/bookings/${id}`, {}, "DELETE");
};