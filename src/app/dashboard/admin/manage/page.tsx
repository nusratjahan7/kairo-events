import { getEvents } from "@/lib/api/events";
import ManageEventsClient from "@/components/events/ManageEventsClient";

interface EventData {
  _id: string;
  title: string;
  venue: string;
  city: string;
  dateTime: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  shortDescription?: string;
}

interface EventsResponse {
  success?: boolean;
  data?: EventData[];
}

const ManageEventsPage = async () => {
  let events: EventData[] = [];

  try {
    const res = (await getEvents()) as EventsResponse | EventData[];
    events = Array.isArray(res) ? res : res?.data || [];
  } catch (error) {
    console.error("Failed to load events on management panel:", error);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-6 text-[#c8f542]">
          Manage Events
        </h1>
        <ManageEventsClient initialEvents={events} />
      </div>
    </div>
  );
};

export default ManageEventsPage;
