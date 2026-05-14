import ProgramAreas from "@/components/wita/ProgramAreas";
import { Card } from "@/components/ui/card";
import { services } from "@/lib/content";

export default function WhatWeDo() {
  return (
    <section className="wita-page">
      <div className="container">
        <div className="wita-page-head reveal-up">
          <p className="eyebrow">What We Do</p>
          <h1>Guiding The Way, Shaping The Future Of African Tourism</h1>
          <p>
            Our approach blends training, knowledge transfer, mentorship, and
            continuous upskilling to support a personalized journey toward
            leadership and impact.
          </p>
        </div>
      </div>

      <ProgramAreas />

      <div className="container">
        <div className="wita-section-heading reveal-up">
          <p className="eyebrow">Services</p>
          <h2>How We Support Women In Tourism</h2>
        </div>

        <div className="wita-service-grid">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="wita-approach-card reveal-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
