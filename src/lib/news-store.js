import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const NEWS_FILE = path.join(process.cwd(), "data", "news.json");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value) {
  const parsed = normalizeText(value);
  if (parsed) {
    return parsed;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());
}

function makeSlug(value) {
  const base = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (base) {
    return base;
  }

  return `news-${Date.now()}`;
}

function ensureUniqueSlug(slug, items, excludeId) {
  const base = makeSlug(slug);
  let candidate = base;
  let counter = 2;

  while (
    items.some(
      (item) =>
        normalizeText(item.slug) === candidate &&
        (!excludeId || normalizeText(item.id) !== normalizeText(excludeId))
    )
  ) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function readNewsRaw() {
  try {
    const raw = await fs.readFile(NEWS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeNewsRaw(items) {
  const dir = path.dirname(NEWS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(NEWS_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function listNews() {
  return readNewsRaw();
}

export async function getNewsBySlug(slug) {
  const target = normalizeText(slug);
  if (!target) {
    return null;
  }
  const items = await readNewsRaw();
  return items.find((item) => normalizeText(item.slug) === target) || null;
}

export async function createNews(payload) {
  const title = normalizeText(payload?.title);
  const summary = normalizeText(payload?.summary);
  const excerpt = normalizeText(payload?.excerpt);
  const category = normalizeText(payload?.category) || "General";
  const date = formatDate(payload?.date);

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!summary) {
    throw new Error("Summary is required.");
  }

  const current = await readNewsRaw();
  const createdAt = new Date().toISOString();
  const slug = ensureUniqueSlug(payload?.slug || title, current);

  const record = {
    id: crypto.randomUUID(),
    slug,
    date,
    category,
    title,
    summary,
    excerpt,
    createdAt,
    updatedAt: createdAt
  };

  const next = [record, ...current];
  await writeNewsRaw(next);
  return record;
}

export async function updateNews(id, payload) {
  const recordId = normalizeText(id);
  if (!recordId) {
    throw new Error("News id is required.");
  }

  const current = await readNewsRaw();
  const index = current.findIndex((item) => item.id === recordId);

  if (index === -1) {
    throw new Error("News item not found.");
  }

  const existing = current[index];
  const title = normalizeText(payload?.title) || existing.title;
  const summary = normalizeText(payload?.summary) || existing.summary;

  const updated = {
    ...existing,
    title,
    summary,
    excerpt: normalizeText(payload?.excerpt) || existing.excerpt || "",
    category: normalizeText(payload?.category) || existing.category || "General",
    date: formatDate(payload?.date || existing.date),
    slug: ensureUniqueSlug(payload?.slug || title || existing.slug, current, recordId),
    updatedAt: new Date().toISOString()
  };

  const next = [...current];
  next[index] = updated;
  await writeNewsRaw(next);
  return updated;
}

export async function deleteNews(id) {
  const recordId = normalizeText(id);
  const current = await readNewsRaw();
  const next = current.filter((item) => item.id !== recordId);

  if (next.length === current.length) {
    throw new Error("News item not found.");
  }

  await writeNewsRaw(next);
  return { id: recordId };
}
