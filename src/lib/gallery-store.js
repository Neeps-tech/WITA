import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";
import { readJsonArray, resolveDataFile, writeJsonArray } from "@/lib/json-store";

const GALLERY_FILE = resolveDataFile("gallery.json");
const GALLERY_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function byNewest(first, second) {
  return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
}

function safeBaseName(value) {
  const normalized = normalizeText(value).toLowerCase();
  const stripped = normalized
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return stripped || `image-${Date.now()}`;
}

function splitNameAndExt(filename) {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex <= 0) {
    return { name: filename, ext: "" };
  }
  return {
    name: filename.slice(0, dotIndex),
    ext: filename.slice(dotIndex).toLowerCase()
  };
}

export async function listGalleryItems() {
  const items = await readJsonArray(GALLERY_FILE);
  return items.sort(byNewest);
}

export async function saveUploadedImage({ originalName, mimeType, size, bytes, caption }) {
  await fs.mkdir(GALLERY_UPLOAD_DIR, { recursive: true });

  const parsed = splitNameAndExt(originalName || "image");
  const base = safeBaseName(parsed.name);
  const extension = parsed.ext || ".jpg";
  const filename = `${base}-${Date.now()}${extension}`;
  const absolutePath = path.join(GALLERY_UPLOAD_DIR, filename);
  const publicUrl = `/uploads/gallery/${filename}`;

  await fs.writeFile(absolutePath, Buffer.from(bytes));

  const current = await readJsonArray(GALLERY_FILE);
  const now = new Date().toISOString();
  const item = {
    id: crypto.randomUUID(),
    filename,
    originalName: normalizeText(originalName) || filename,
    url: publicUrl,
    mimeType: normalizeText(mimeType) || "application/octet-stream",
    size: Number(size) || 0,
    caption: normalizeText(caption),
    createdAt: now
  };

  const next = [item, ...current];
  await writeJsonArray(GALLERY_FILE, next);
  return item;
}

export async function deleteGalleryItem(id) {
  const targetId = normalizeText(id);
  const current = await readJsonArray(GALLERY_FILE);
  const index = current.findIndex((item) => item.id === targetId);

  if (index === -1) {
    throw new Error("Gallery item not found.");
  }

  const [removed] = current.splice(index, 1);
  await writeJsonArray(GALLERY_FILE, current);

  const filePath = path.join(GALLERY_UPLOAD_DIR, removed.filename);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  return removed;
}
