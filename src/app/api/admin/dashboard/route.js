import { NextResponse } from "next/server";
import { listNews } from "@/lib/news-store";
import { listContactMessages } from "@/lib/contact-store";
import { listNewsletterSubscribers } from "@/lib/newsletter-store";
import { buildDashboardMetrics } from "@/lib/dashboard-metrics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [newsItems, contactMessages, subscribers] = await Promise.all([
      listNews(),
      listContactMessages(),
      listNewsletterSubscribers()
    ]);

    const metrics = buildDashboardMetrics({
      newsItems,
      contactMessages,
      subscribers
    });

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load dashboard metrics." },
      { status: 500 }
    );
  }
}
