import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/events-store";
import { requireAdminApiSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await listEvents();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load events." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const payload = await request.json();
    const created = await createEvent(payload);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create event." },
      { status: 400 }
    );
  }
}
