import crypto from "crypto";
import { readJsonArray, resolveDataFile, writeJsonArray } from "@/lib/json-store";

const NEWSLETTER_FILE = resolveDataFile("newsletter-subscribers.json");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function byNewest(first, second) {
  return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
}

export async function listNewsletterSubscribers() {
  const items = await readJsonArray(NEWSLETTER_FILE);
  return items.sort(byNewest);
}

export async function createNewsletterSubscriber(payload) {
  const email = normalizeText(payload?.email).toLowerCase();
  if (!email || !isValidEmail(email)) {
    throw new Error("A valid email address is required.");
  }

  const current = await readJsonArray(NEWSLETTER_FILE);
  const exists = current.some((item) => normalizeText(item.email).toLowerCase() === email);

  if (exists) {
    const duplicate = new Error("This email is already subscribed.");
    duplicate.code = "DUPLICATE_EMAIL";
    throw duplicate;
  }

  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    email,
    source: "newsletter-form",
    createdAt: now
  };

  const next = [record, ...current];
  await writeJsonArray(NEWSLETTER_FILE, next);
  return record;
}
