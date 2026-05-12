import Image from "next/image";
import { focusGroups } from "@/lib/content";

const visualBlocks = [
  {
    type: "single",
    src: "/images/women.png",
    alt: "Young women in tourism workshop",
    position: "30% center"
  },
  {
    type: "single",
    src: "/images/woman.png",
    alt: "Women-owned tourism enterprise",
    position: "center center"
  },
  {
    type: "collage",
    tiles: [
      { src: "/images/women.png", alt: "Women in hospitality front desk", position: "center center" },
      { src: "/images/women.png", alt: "Women in tourism field work", position: "right center" },
      { src: "/images/woman.png", alt: "Women in hospitality operations", position: "left center" },
      { src: "/images/woman.png", alt: "Women in hospitality mentorship", position: "center center" }
    ]
  }
];

export default function StatsSection() {
  return (
    <section className="wita-focus">
      <div className="container">
        <div className="wita-impact-head reveal-up">
          <p className="wita-impact-eyebrow">Our Impact</p>
          <h2>Championing Women in Tourism</h2>
        </div>

        <div className="wita-impact-grid">
          {focusGroups.map((item, index) => (
            <article
              key={item.title}
              className="wita-impact-card reveal-up"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {visualBlocks[index].type === "single" ? (
                <div className="wita-impact-media">
                  <Image
                    src={visualBlocks[index].src}
                    alt={visualBlocks[index].alt}
                    fill
                    className="cover"
                    style={{ objectPosition: visualBlocks[index].position }}
                  />
                </div>
              ) : (
                <div className="wita-impact-collage">
                  {visualBlocks[index].tiles.map((tile) => (
                    <div className="wita-impact-tile" key={tile.alt}>
                      <Image
                        src={tile.src}
                        alt={tile.alt}
                        fill
                        className="cover"
                        style={{ objectPosition: tile.position }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="wita-impact-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
