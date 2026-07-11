import { requireRole } from "@/lib/core/session";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireRole("admin");

  return <>{children}</>;
}
