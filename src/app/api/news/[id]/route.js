import { NextResponse } from "next/server";
import { deleteNews, updateNews } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const payload = await request.json();
    const updated = await updateNews(params.id, payload);
    return NextResponse.json({ item: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update news item." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const deleted = await deleteNews(params.id);
    return NextResponse.json({ item: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete news item." },
      { status: 400 }
    );
  }
}
