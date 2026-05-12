import { NextResponse } from "next/server";
import { createNews, listNews } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await listNews();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load news." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const created = await createNews(payload);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create news item." },
      { status: 400 }
    );
  }
}
