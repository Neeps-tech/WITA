import crypto from "crypto";
import { readJsonArray, resolveDataFile, writeJsonArray } from "@/lib/json-store";

const CONTACT_FILE = resolveDataFile("contact-messages.json");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function byNewest(first, second) {
  return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
}

export async function listContactMessages() {
  const items = await readJsonArray(CONTACT_FILE);
  return items.sort(byNewest);
}

export async function createContactMessage(payload) {
  const fullName = normalizeText(payload?.fullName);
  const email = normalizeText(payload?.email).toLowerCase();
  const organization = normalizeText(payload?.organization);
  const message = normalizeText(payload?.message);

  if (!fullName) {
    throw new Error("Full name is required.");
  }
  if (!email || !isValidEmail(email)) {
    throw new Error("A valid email address is required.");
  }
  if (!message) {
    throw new Error("Message is required.");
  }

  const current = await readJsonArray(CONTACT_FILE);
  const now = new Date().toISOString();

  const record = {
    id: crypto.randomUUID(),
    fullName,
    email,
    organization,
    message,
    source: "contact-form",
    createdAt: now
  };

  const next = [record, ...current];
  await writeJsonArray(CONTACT_FILE, next);
  return record;
}
