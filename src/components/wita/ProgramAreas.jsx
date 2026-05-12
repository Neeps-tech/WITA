import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { programAreas } from "@/lib/content";

export default function ProgramAreas() {
  return (
    <section className="wita-programs">
      <div className="container">
        <div className="wita-section-heading reveal-up">
          <p className="eyebrow">WITA Program Areas</p>
          <h2>WITA&apos;s Core Program Areas</h2>
        </div>

        <div className="wita-program-grid">
          {programAreas.map((program, index) => (
            <Card
              key={program.title}
              className="wita-program-card reveal-up"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <div className="wita-program-card-top">
                <h3>{program.title}</h3>
                <ArrowUpRight size={20} />
              </div>
              <p>{program.description}</p>
              <ul>
                {program.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
