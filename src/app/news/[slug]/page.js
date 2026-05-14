import SiteLayout from "@/components/wita/SiteLayout";
import { Card } from "@/components/ui/card";
import { getNewsBySlug } from "@/lib/news-store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }) {
  const item = await getNewsBySlug(params.slug);

  if (!item) {
    notFound();
  }

  return (
    <SiteLayout>
      <section className="wita-page">
        <div className="container">
          <div className="wita-page-head reveal-up">
            <p className="eyebrow">{item.category || "News"}</p>
            <h1>{item.title}</h1>
            <p>{item.date}</p>
          </div>

          <Card className="wita-news-row">
            <p>{item.summary}</p>
            {item.excerpt ? <p>{item.excerpt}</p> : null}
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
