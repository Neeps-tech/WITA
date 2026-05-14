import { NextResponse } from "next/server";
import { createContactMessage, listContactMessages } from "@/lib/contact-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await listContactMessages();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load contact messages." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const created = await createContactMessage(payload);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save contact message." },
      { status: 400 }
    );
  }
}
