import EventDetailsClient from "@/components/events/EventDetailsClient";
import { getEventsDetails } from "@/lib/api/events";
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

interface APIError {
  status?: number;
  response?: {
    status?: number;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const EventDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  let event: EventData | null = null;
  let isUnauthorized = false;

  try {
    const res = (await getEventsDetails(id)) as EventAPIResponse;
    event = res?.data || (res as unknown as EventData);
  } catch (err: unknown) {
    console.error("Error fetching event details on server:", err);

    const error = err as APIError;
    if (error?.status === 401 || error?.response?.status === 401) {
      isUnauthorized = true;
    }
  }

  if (isUnauthorized) {
    redirect(`/signin?callbackUrl=/events/${id}`);
  }

  if (!event) {
    notFound();
  }

  return <EventDetailsClient event={event} />;
};

export default EventDetailsPage;
