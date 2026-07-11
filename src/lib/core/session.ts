"use server"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";


interface AuthUser {
  id: string;
  email: string;
  role: string;
  [key: string]: unknown; 
}


export const getUserSession = async (): Promise<AuthUser | null> => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return (session?.user as AuthUser) || null;
}


export const getUserToken = async (): Promise<string | null> => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.session?.token || null;
}


export const requireRole = async (role: string): Promise<AuthUser> => {
    const user = await getUserSession();
    
    if (!user) {
        redirect('/auth/signin');
    }
    
    if (user.role !== role) {
        redirect('/unauthorized');
    }
    
    return user;
}