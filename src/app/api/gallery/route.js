import { NextResponse } from "next/server";
import { listGalleryItems } from "@/lib/gallery-store";
import { requireAdminApiSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const items = await listGalleryItems();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load gallery items." },
      { status: 500 }
    );
  }
}
