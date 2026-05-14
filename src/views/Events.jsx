import { Card } from "@/components/ui/card";
import { events as fallbackEvents } from "@/lib/content";
import { listEvents } from "@/lib/events-store";

export default async function Events() {
  const dynamicEvents = await listEvents();
  const events = dynamicEvents.length > 0 ? dynamicEvents : fallbackEvents;

  return (
    <section className="wita-page">
      <div className="container">
        <div className="wita-page-head reveal-up">
          <p className="eyebrow">Events</p>
          <h1>Upcoming WITA Engagements</h1>
          <p>
            Stay connected with our latest events, workshops, and networking opportunities 
            designed to empower women in the African tourism sector.
          </p>
        </div>
      </div>

      <div className="container wita-events-wrap" style={{ marginTop: '0' }}>
        <div className="wita-events-grid">
          {events.map((event, index) => (
            <Card
              key={event.title}
              className="wita-event-card reveal-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="wita-event-date">
                <span>{event.day}</span>
                <small>{event.month}</small>
              </div>
              <div>
                <h3>{event.title}</h3>
                <p>{event.schedule}</p>
                <p>{event.venue}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
