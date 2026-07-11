import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authHeader = async (): Promise<Record<string, string>> => {
  const token = await getUserToken();
  return token ? { authorization: `Bearer ${token}` } : {};
};

type HTTPMethod = "POST" | "PUT" | "PATCH" | "DELETE" | "GET";

const handleStatus = async <T>(res: Response): Promise<T> => {
  if (res.status === 401) {
    redirect("/unauthorized");
  } else if (res.status === 403) {
    redirect("/forbidden");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
};

// public fetch
export const serverFetch = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`);
  return handleStatus<T>(res);
};

// private fetch
export const protectedFetch = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
  });

  return handleStatus<T>(res);
};


export const serverMutation = async <T, D = unknown>(
  path: string,
  data: D,
  method: HTTPMethod = "POST"
): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "content-type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  return handleStatus<T>(res);
};