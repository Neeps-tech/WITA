import Link from "next/link";
import { Card } from "@/components/ui/card";
import { listNews } from "@/lib/news-store";

export default async function News() {
  const newsItems = await listNews();

  return (
    <section className="wita-page">
      <div className="container">
        <div className="wita-page-head reveal-up">
          <p className="eyebrow">News</p>
          <h1>WITA News & Industry Highlights</h1>
          <p>
            Insights, stories, and sector updates connected to women in tourism,
            leadership, and inclusive growth across Africa.
          </p>
        </div>

        <div className="wita-news-list">
          {newsItems.map((item, index) => (
            <Card
              key={item.id}
              className="wita-news-row reveal-up"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <p className="wita-news-date">{item.date}</p>
              <p className="wita-news-tag">{item.category}</p>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              {item.excerpt ? <p>{item.excerpt}</p> : null}
              <Link href={item.slug ? `/news/${item.slug}` : "/news"} className="wita-news-link">
                Read More
              </Link>
            </Card>
          ))}

          {newsItems.length === 0 ? (
            <Card className="wita-news-row">
              <h2>No News Yet</h2>
              <p>Use the admin portal to publish your first news item.</p>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
