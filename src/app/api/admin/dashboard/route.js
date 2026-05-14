import { NextResponse } from "next/server";
import { listNews } from "@/lib/news-store";
import { listEvents } from "@/lib/events-store";
import { listContactMessages } from "@/lib/contact-store";
import { listNewsletterSubscribers } from "@/lib/newsletter-store";
import { listGalleryItems } from "@/lib/gallery-store";
import { buildDashboardMetrics } from "@/lib/dashboard-metrics";
import { requireAdminApiSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const [newsItems, eventsItems, contactMessages, subscribers, galleryItems] = await Promise.all([
      listNews(),
      listEvents(),
      listContactMessages(),
      listNewsletterSubscribers(),
      listGalleryItems()
    ]);

    const metrics = buildDashboardMetrics({
      newsItems,
      eventsItems,
      contactMessages,
      subscribers,
      galleryItems
    });

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load dashboard metrics." },
      { status: 500 }
    );
  }
}
