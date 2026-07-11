import { serverMutation } from "../core/server";

export const updateEvent = async (id: string, data: unknown) => {
    return serverMutation(`/events/${id}`, data, "PUT");
};
export const deleteEvent = async (id: string) => {
    return serverMutation(`/events/${id}`, {}, "DELETE");
};