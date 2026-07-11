import EventDetailsClient from "@/components/events/EventDetailsClient";
import { getEventsDetails } from "@/lib/api/events";
import { notFound } from "next/navigation";

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

  let event = null;
  try {
    const res = (await getEventsDetails(id)) as EventAPIResponse;
    event = res?.data || (res as unknown as EventData);
  } catch (error) {
    console.error("Error fetching event details on server:", error);
  }

  if (!event) {
    notFound();
  }

  return <EventDetailsClient event={event} />;
};

export default EventDetailsPage;
