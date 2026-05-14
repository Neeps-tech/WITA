import { NextResponse } from "next/server";
import { deleteEvent, updateEvent } from "@/lib/events-store";
import { requireAdminApiSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const payload = await request.json();
    const updated = await updateEvent(params.id, payload);
    return NextResponse.json({ item: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update event." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const deleted = await deleteEvent(params.id);
    return NextResponse.json({ item: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete event." },
      { status: 400 }
    );
  }
}
