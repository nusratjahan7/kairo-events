import { serverMutation } from "../core/server";

export const updateUserRole = async (id: string, role: "user" | "admin") => {
    return serverMutation(`/api/admin/users/${id}/role`, { role }, "PUT");
};