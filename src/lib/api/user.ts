import { protectedFetch } from "../core/server";

export interface AppUser {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
}

export const getUsers = async (): Promise<AppUser[]> => {
    return protectedFetch("/api/admin/users");
};