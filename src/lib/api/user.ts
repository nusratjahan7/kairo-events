import { protectedFetch } from "../core/server";

export const getUsers = async () => {
    return protectedFetch("/api/admin/users");
};