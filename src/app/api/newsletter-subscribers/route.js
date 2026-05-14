import { NextResponse } from "next/server";
import {
  createNewsletterSubscriber,
  listNewsletterSubscribers
} from "@/lib/newsletter-store";
import { requireAdminApiSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const items = await listNewsletterSubscribers();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load newsletter subscribers." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const created = await createNewsletterSubscriber(payload);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    const status = error.code === "DUPLICATE_EMAIL" ? 409 : 400;
    return NextResponse.json(
      { error: error.message || "Failed to add newsletter subscriber." },
      { status }
    );
  }
}
