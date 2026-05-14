import { NextResponse } from "next/server";
import { isLocalDevAdminBypassEnabled, requireAdminApiSession } from "@/lib/admin-auth";
import { listNews } from "@/lib/news-store";
import { listEvents } from "@/lib/events-store";
import { listContactMessages } from "@/lib/contact-store";
import { listNewsletterSubscribers } from "@/lib/newsletter-store";
import { listGalleryItems } from "@/lib/gallery-store";

export const dynamic = "force-dynamic";

async function runCheck({ key, label, fn }) {
  try {
    const value = await fn();
    return {
      key,
      label,
      status: "up",
      message: typeof value === "string" ? value : "OK"
    };
  } catch (error) {
    return {
      key,
      label,
      status: "down",
      message: error.message || "Error"
    };
  }
}

export async function GET() {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const checks = await Promise.all([
      runCheck({
        key: "news_api",
        label: "News Data API",
        fn: async () => `Loaded ${(await listNews()).length} records`
      }),
      runCheck({
        key: "events_api",
        label: "Events Data API",
        fn: async () => `Loaded ${(await listEvents()).length} records`
      }),
      runCheck({
        key: "contacts_api",
        label: "Contact Leads API",
        fn: async () => `Loaded ${(await listContactMessages()).length} records`
      }),
      runCheck({
        key: "subscribers_api",
        label: "Newsletter API",
        fn: async () => `Loaded ${(await listNewsletterSubscribers()).length} records`
      }),
      runCheck({
        key: "gallery_api",
        label: "Gallery API",
        fn: async () => `Loaded ${(await listGalleryItems()).length} records`
      }),
      runCheck({
        key: "oauth_config",
        label: "OAuth Config",
        fn: async () => {
          if (isLocalDevAdminBypassEnabled()) {
            return "Local dev bypass enabled; OAuth credential check skipped";
          }

          const hasGoogleId = Boolean(process.env.GOOGLE_CLIENT_ID);
          const hasGoogleSecret = Boolean(process.env.GOOGLE_CLIENT_SECRET);
          const hasSecret = Boolean(process.env.NEXTAUTH_SECRET);
          if (!hasGoogleId || !hasGoogleSecret || !hasSecret) {
            throw new Error("Missing one or more OAuth environment variables.");
          }
          return "Environment variables are configured";
        }
      })
    ]);

    const upCount = checks.filter((item) => item.status === "up").length;
    const downCount = checks.length - upCount;

    return NextResponse.json({
      checks,
      summary: {
        total: checks.length,
        up: upCount,
        down: downCount
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to run API health checks." },
      { status: 500 }
    );
  }
}
