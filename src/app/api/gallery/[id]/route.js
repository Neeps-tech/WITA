import { NextResponse } from "next/server";
import { deleteGalleryItem } from "@/lib/gallery-store";
import { requireAdminApiSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(_request, { params }) {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const removed = await deleteGalleryItem(params.id);
    return NextResponse.json({ item: removed });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete gallery image." },
      { status: 400 }
    );
  }
}
