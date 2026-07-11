import { serverFetch } from "../core/server";


export const getEvents = async () => {
    return serverFetch('/events');
}