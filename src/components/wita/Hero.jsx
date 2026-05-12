import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/lib/content";

export default function Hero() {
  return (
    <section className="wita-hero">
      <div className="wita-hero-media">
        <Image
          src="/images/women.png"
          alt="Women in Tourism Africa members"
          fill
          priority
          className="cover"
        />
      </div>

      <div className="container wita-hero-content">
        <div className="wita-hero-copy reveal-up">
          <p className="wita-hero-badge">{heroContent.badge}</p>
          <h1>
            Women in Tourism
            <span>Africa</span>
          </h1>
          <p className="lead">{heroContent.summary}</p>
          <p>
            Serving as a continental catalyst, connecting women entrepreneurs,
            professionals, and community champions to resources, networks,
            markets, and influence.
          </p>
          <div className="wita-hero-actions">
            <Button className="wita-hero-primary">
              Explore Our Work <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" className="wita-hero-secondary">
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
