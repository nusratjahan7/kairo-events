import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import EventDashboardLayout from "@/components/dashboard/EventDashboardLayout";

interface MainDashboardLayoutProps {
  children: React.ReactNode;
}

export default async function MainDashboardLayout({
  children,
}: MainDashboardLayoutProps) {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="pt-15">
      <EventDashboardLayout userRole={user?.role as "user" | "admin"}>
        {children}
      </EventDashboardLayout>
    </div>
  );
}
