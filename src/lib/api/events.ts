import { protectedFetch, serverFetch } from "../core/server";


export const getEvents = async () => {
    return serverFetch('/events');
}

export const getEventsDetails = async (id: string) => {
    return protectedFetch(`/events/${id}`);
};