import Link from "next/link";
import { Card } from "@/components/ui/card";
import { listNews } from "@/lib/news-store";

export default async function NewsSection() {
  const newsItems = await listNews();
  const featured = newsItems.slice(0, 3);

  return (
    <section className="wita-news">
      <div className="container">
        <div className="wita-section-heading light reveal-up">
          <p className="eyebrow">News</p>
          <h2>Latest WITA Stories</h2>
        </div>

        <div className="wita-news-grid">
          {featured.map((item, index) => (
            <Card
              key={item.id}
              className="wita-news-card reveal-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="wita-news-date">{item.date}</p>
              <p className="wita-news-tag">{item.category}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link href="/news" className="wita-news-link">
                Read More
              </Link>
            </Card>
          ))}

          {featured.length === 0 ? (
            <Card className="wita-news-card">
              <h3>No News Published</h3>
              <p>
                Your news cards will appear here after they are added from the
                admin portal.
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
