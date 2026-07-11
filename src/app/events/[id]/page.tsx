import EventDetailsClient from "@/components/events/EventDetailsClient";
import { getEventsDetails } from "@/lib/api/events";
import { getUserSession } from "@/lib/core/session";
import { notFound, redirect } from "next/navigation";

interface EventData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  dateTime: string;
  city: string;
  venue: string;
  price: number;
  imageUrl?: string;
}

interface EventAPIResponse {
  success?: boolean;
  data?: EventData;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const EventDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const session = await getUserSession();
  if (!session) {
    redirect(`/auth/signin?callbackUrl=/events/${id}`);
  }

  let event: EventData | null = null;

  try {
    const res = (await getEventsDetails(id)) as EventAPIResponse;
    event = res?.data || (res as unknown as EventData);
  } catch (err: unknown) {
    console.error("Error fetching event details on server:", err);
  }

  if (!event) {
    notFound();
  }

  return <EventDetailsClient event={event} />;
};

export default EventDetailsPage;
