import { NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/gallery-store";
import { requireAdminApiSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const unauthorized = await requireAdminApiSession();
    if (unauthorized) {
      return unauthorized;
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const caption = formData.get("caption");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Max upload size is 10MB." },
        { status: 400 }
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP, and GIF files are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const created = await saveUploadedImage({
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      bytes,
      caption: typeof caption === "string" ? caption : ""
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to upload image." },
      { status: 400 }
    );
  }
}
