import Image from "next/image";
import { Card } from "@/components/ui/card";
import { thematicPillars, whoWeAre } from "@/lib/content";

export default function WhoWeAre() {
  return (
    <section className="wita-page">
      <div className="container">
        <div className="wita-page-head reveal-up">
          <p className="eyebrow">Who We Are</p>
          <h1>{whoWeAre.title}</h1>
          <p>{whoWeAre.intro}</p>
        </div>

        <div className="wita-split reveal-up delay-2">
          <div className="wita-image-frame">
            <Image
              src="/images/african-girls.png"
              alt="Women in Tourism Africa community"
              fill
              className="cover who-we-are-photo"
            />
          </div>
          <Card className="wita-story-card">
            <h2>{whoWeAre.storyHeading}</h2>
            {whoWeAre.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Card>
        </div>

        <div className="wita-identity-grid">
          <Card className="reveal-up">
            <h3>Why WITA Exists</h3>
            <p>{whoWeAre.rationale}</p>
          </Card>
          <Card className="reveal-up">
            <h3>Vision</h3>
            <p>{whoWeAre.vision}</p>
          </Card>
          <Card className="reveal-up">
            <h3>Mission</h3>
            <p>{whoWeAre.mission}</p>
          </Card>
        </div>

        <Card className="wita-pillar-card reveal-up">
          <h3>WITA Thematic Pillars</h3>
          <ul className="wita-pillar-list">
            {thematicPillars.map((pillar) => (
              <li key={pillar}>{pillar}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
