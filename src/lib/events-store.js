import crypto from "crypto";
import { readJsonArray, resolveDataFile, writeJsonArray } from "@/lib/json-store";

const EVENTS_FILE = resolveDataFile("events.json");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function listEvents() {
  return readJsonArray(EVENTS_FILE);
}

export async function createEvent(payload) {
  const day = normalizeText(payload?.day);
  const month = normalizeText(payload?.month);
  const title = normalizeText(payload?.title);
  const schedule = normalizeText(payload?.schedule);
  const venue = normalizeText(payload?.venue);

  if (!day || !month || !title || !schedule || !venue) {
    throw new Error("Day, month, title, schedule, and venue are required.");
  }

  const current = await readJsonArray(EVENTS_FILE);
  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    day,
    month,
    title,
    schedule,
    venue,
    createdAt: now,
    updatedAt: now
  };

  const next = [record, ...current];
  await writeJsonArray(EVENTS_FILE, next);
  return record;
}

export async function updateEvent(id, payload) {
  const eventId = normalizeText(id);
  if (!eventId) {
    throw new Error("Event id is required.");
  }

  const current = await readJsonArray(EVENTS_FILE);
  const index = current.findIndex((item) => item.id === eventId);

  if (index === -1) {
    throw new Error("Event not found.");
  }

  const existing = current[index];
  const updated = {
    ...existing,
    day: normalizeText(payload?.day) || existing.day,
    month: normalizeText(payload?.month) || existing.month,
    title: normalizeText(payload?.title) || existing.title,
    schedule: normalizeText(payload?.schedule) || existing.schedule,
    venue: normalizeText(payload?.venue) || existing.venue,
    updatedAt: new Date().toISOString()
  };

  const next = [...current];
  next[index] = updated;
  await writeJsonArray(EVENTS_FILE, next);
  return updated;
}

export async function deleteEvent(id) {
  const eventId = normalizeText(id);
  const current = await readJsonArray(EVENTS_FILE);
  const next = current.filter((item) => item.id !== eventId);

  if (next.length === current.length) {
    throw new Error("Event not found.");
  }

  await writeJsonArray(EVENTS_FILE, next);
  return { id: eventId };
}
