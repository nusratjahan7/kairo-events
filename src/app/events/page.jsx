import { getEvents } from "@/lib/api/events";
import EventListContainer from "@/components/events/EventListContainer"

export const revalidate = 0;

const EventsPage = async () => {
    const res = await getEvents();
    const events = res?.data || res || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
            <div className="mx-auto max-w-7xl">
                {/* Header (Server Rendered) */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold uppercase tracking-[0.2em] text-white">
                        Explore Events
                    </h1>
                    <p className="text-xs text-white/40 mt-2 uppercase tracking-widest">
                        Discover premium music, tech, arts, and sports experiences
                    </p>
                </div>


                <EventListContainer initialEvents={events} />
            </div>
        </div>
    );
};

export default EventsPage;