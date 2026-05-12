"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const emptyForm = {
  date: "",
  category: "",
  title: "",
  summary: "",
  excerpt: ""
};

function normalizeApiError(error, fallback) {
  if (!error) {
    return fallback;
  }
  return error.message || fallback;
}

export default function NewsAdminPortal() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function loadItems() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/news", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load news.");
      }
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(normalizeApiError(err, "Failed to load news."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function onCreateChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onEditChange(field, value) {
    setEditingForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditingForm({
      date: item.date || "",
      category: item.category || "",
      title: item.title || "",
      summary: item.summary || "",
      excerpt: item.excerpt || ""
    });
    setStatus("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingForm(emptyForm);
  }

  async function createItem(event) {
    event.preventDefault();
    try {
      setStatus("");
      setError("");
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create news item.");
      }
      setForm(emptyForm);
      setStatus("News item published.");
      await loadItems();
    } catch (err) {
      setError(normalizeApiError(err, "Failed to create news item."));
    }
  }

  async function updateItem(id) {
    try {
      setStatus("");
      setError("");
      const response = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingForm)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update news item.");
      }
      setEditingId(null);
      setEditingForm(emptyForm);
      setStatus("News item updated.");
      await loadItems();
    } catch (err) {
      setError(normalizeApiError(err, "Failed to update news item."));
    }
  }

  async function deleteItem(id) {
    const proceed = window.confirm("Delete this news item?");
    if (!proceed) {
      return;
    }

    try {
      setStatus("");
      setError("");
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete news item.");
      }
      setStatus("News item deleted.");
      await loadItems();
    } catch (err) {
      setError(normalizeApiError(err, "Failed to delete news item."));
    }
  }

  return (
    <section className="wita-admin-page">
      <div className="container">
        <div className="wita-page-head">
          <p className="eyebrow">Admin Portal</p>
          <h1>Manage News Cards</h1>
          <p>
            Add, edit, and remove news cards that appear on the home page and the
            full news page.
          </p>
        </div>

        <Card className="wita-admin-card">
          <h2>Create News Item</h2>
          <form className="wita-admin-form" onSubmit={createItem}>
            <Input
              placeholder="Date (example: January 11, 2025)"
              value={form.date}
              onChange={(event) => onCreateChange("date", event.target.value)}
            />
            <Input
              placeholder="Category (example: Our Story)"
              value={form.category}
              onChange={(event) => onCreateChange("category", event.target.value)}
            />
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(event) => onCreateChange("title", event.target.value)}
              required
            />
            <Textarea
              placeholder="Summary"
              value={form.summary}
              onChange={(event) => onCreateChange("summary", event.target.value)}
              required
            />
            <Textarea
              placeholder="Excerpt (optional)"
              value={form.excerpt}
              onChange={(event) => onCreateChange("excerpt", event.target.value)}
            />
            <Button type="submit">Publish News</Button>
          </form>
        </Card>

        {status ? <p className="wita-admin-status">{status}</p> : null}
        {error ? <p className="wita-admin-error">{error}</p> : null}

        <div className="wita-admin-list">
          {loading ? <p>Loading news...</p> : null}

          {!loading && items.length === 0 ? (
            <Card className="wita-admin-card">
              <p>No news items yet.</p>
            </Card>
          ) : null}

          {items.map((item) => (
            <Card key={item.id} className="wita-admin-card">
              {editingId === item.id ? (
                <div className="wita-admin-form">
                  <Input
                    value={editingForm.date}
                    onChange={(event) => onEditChange("date", event.target.value)}
                  />
                  <Input
                    value={editingForm.category}
                    onChange={(event) => onEditChange("category", event.target.value)}
                  />
                  <Input
                    value={editingForm.title}
                    onChange={(event) => onEditChange("title", event.target.value)}
                  />
                  <Textarea
                    value={editingForm.summary}
                    onChange={(event) => onEditChange("summary", event.target.value)}
                  />
                  <Textarea
                    value={editingForm.excerpt}
                    onChange={(event) => onEditChange("excerpt", event.target.value)}
                  />

                  <div className="wita-admin-actions">
                    <Button type="button" onClick={() => updateItem(item.id)}>
                      Save Changes
                    </Button>
                    <button
                      type="button"
                      className="wita-admin-link"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="wita-news-date">{item.date}</p>
                  <p className="wita-news-tag">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  {item.excerpt ? <p>{item.excerpt}</p> : null}

                  <div className="wita-admin-actions">
                    <Button type="button" variant="dark" onClick={() => startEdit(item)}>
                      Edit
                    </Button>
                    <button
                      type="button"
                      className="wita-admin-delete"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
