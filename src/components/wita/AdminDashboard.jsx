"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
  { key: "kpis", label: "KPI Dashboard" },
  { key: "news", label: "Manage News" },
  { key: "events", label: "Manage Events" },
  { key: "gallery", label: "Gallery Uploads" },
  { key: "apis", label: "API Health" }
];

const emptyNewsForm = {
  date: "",
  category: "",
  title: "",
  summary: "",
  excerpt: ""
};

const emptyEventForm = {
  day: "",
  month: "",
  title: "",
  schedule: "",
  venue: ""
};

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(parsed);
}

function toMaxValue(items) {
  return items.reduce((max, current) => Math.max(max, current.total || 0), 0);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }
  return payload;
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("kpis");

  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [globalStatus, setGlobalStatus] = useState("");

  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsForm, setNewsForm] = useState(emptyNewsForm);
  const [editingNewsId, setEditingNewsId] = useState("");
  const [editingNewsForm, setEditingNewsForm] = useState(emptyNewsForm);

  const [eventItems, setEventItems] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [editingEventId, setEditingEventId] = useState("");
  const [editingEventForm, setEditingEventForm] = useState(emptyEventForm);

  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState("");

  const trendMax = useMemo(
    () => toMaxValue(dashboardData?.trend || []),
    [dashboardData?.trend]
  );

  async function loadDashboard() {
    try {
      setDashboardLoading(true);
      setDashboardError("");
      const payload = await fetchJson("/api/admin/dashboard", { cache: "no-store" });
      setDashboardData(payload);
    } catch (error) {
      setDashboardError(error.message || "Failed to load dashboard.");
    } finally {
      setDashboardLoading(false);
    }
  }

  async function loadNews() {
    try {
      setNewsLoading(true);
      const payload = await fetchJson("/api/news", { cache: "no-store" });
      setNewsItems(Array.isArray(payload.items) ? payload.items : []);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to load news.");
    } finally {
      setNewsLoading(false);
    }
  }

  async function loadEvents() {
    try {
      setEventsLoading(true);
      const payload = await fetchJson("/api/events", { cache: "no-store" });
      setEventItems(Array.isArray(payload.items) ? payload.items : []);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to load events.");
    } finally {
      setEventsLoading(false);
    }
  }

  async function loadGallery() {
    try {
      setGalleryLoading(true);
      const payload = await fetchJson("/api/gallery", { cache: "no-store" });
      setGalleryItems(Array.isArray(payload.items) ? payload.items : []);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to load gallery.");
    } finally {
      setGalleryLoading(false);
    }
  }

  async function loadHealth() {
    try {
      setHealthLoading(true);
      setHealthError("");
      const payload = await fetchJson("/api/admin/health", { cache: "no-store" });
      setHealthData(payload);
    } catch (error) {
      setHealthError(error.message || "Failed to load API health.");
    } finally {
      setHealthLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeSection === "news") {
      loadNews();
    }
    if (activeSection === "events") {
      loadEvents();
    }
    if (activeSection === "gallery") {
      loadGallery();
    }
    if (activeSection === "apis") {
      loadHealth();
    }
  }, [activeSection]);

  async function handleCreateNews(event) {
    event.preventDefault();
    try {
      setGlobalStatus("");
      await fetchJson("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsForm)
      });
      setNewsForm(emptyNewsForm);
      setGlobalStatus("News item created.");
      await Promise.all([loadNews(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to create news item.");
    }
  }

  async function handleUpdateNews(id) {
    try {
      setGlobalStatus("");
      await fetchJson(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingNewsForm)
      });
      setEditingNewsId("");
      setEditingNewsForm(emptyNewsForm);
      setGlobalStatus("News item updated.");
      await Promise.all([loadNews(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to update news item.");
    }
  }

  async function handleDeleteNews(id) {
    const confirmed = window.confirm("Delete this news item?");
    if (!confirmed) {
      return;
    }

    try {
      setGlobalStatus("");
      await fetchJson(`/api/news/${id}`, { method: "DELETE" });
      setGlobalStatus("News item deleted.");
      await Promise.all([loadNews(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to delete news item.");
    }
  }

  async function handleCreateEvent(event) {
    event.preventDefault();
    try {
      setGlobalStatus("");
      await fetchJson("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm)
      });
      setEventForm(emptyEventForm);
      setGlobalStatus("Event created.");
      await Promise.all([loadEvents(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to create event.");
    }
  }

  async function handleUpdateEvent(id) {
    try {
      setGlobalStatus("");
      await fetchJson(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEventForm)
      });
      setEditingEventId("");
      setEditingEventForm(emptyEventForm);
      setGlobalStatus("Event updated.");
      await Promise.all([loadEvents(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to update event.");
    }
  }

  async function handleDeleteEvent(id) {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) {
      return;
    }

    try {
      setGlobalStatus("");
      await fetchJson(`/api/events/${id}`, { method: "DELETE" });
      setGlobalStatus("Event deleted.");
      await Promise.all([loadEvents(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to delete event.");
    }
  }

  async function handleUploadImage(uploadEvent) {
    uploadEvent.preventDefault();
    if (!selectedFile) {
      setGlobalStatus("Please choose an image to upload.");
      return;
    }

    try {
      setUploading(true);
      setGlobalStatus("");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("caption", galleryCaption);

      await fetchJson("/api/gallery/upload", {
        method: "POST",
        body: formData
      });

      setSelectedFile(null);
      setGalleryCaption("");
      setGlobalStatus("Image uploaded to gallery.");
      await Promise.all([loadGallery(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(id) {
    const confirmed = window.confirm("Delete this image?");
    if (!confirmed) {
      return;
    }

    try {
      setGlobalStatus("");
      await fetchJson(`/api/gallery/${id}`, { method: "DELETE" });
      setGlobalStatus("Image deleted.");
      await Promise.all([loadGallery(), loadDashboard()]);
    } catch (error) {
      setGlobalStatus(error.message || "Failed to delete image.");
    }
  }

  function renderKpis() {
    return (
      <>
        <div className="wita-admin-top-actions">
          <Button type="button" onClick={loadDashboard}>
            Refresh KPI Data
          </Button>
        </div>

        {dashboardLoading ? <p>Loading KPI dashboard...</p> : null}
        {dashboardError ? <p className="wita-admin-error">{dashboardError}</p> : null}

        {!dashboardLoading && !dashboardError && dashboardData ? (
          <>
            <div className="wita-kpi-grid">
              {dashboardData.kpis.map((item) => (
                <Card key={item.key} className="wita-kpi-card">
                  <p className="wita-kpi-label">{item.label}</p>
                  <p className="wita-kpi-value">{item.value}</p>
                  <p className="wita-kpi-helper">{item.helper}</p>
                </Card>
              ))}
            </div>

            <div className="wita-admin-insights">
              <Card className="wita-admin-card">
                <h2>Monthly Activity</h2>
                <p className="wita-admin-muted">
                  News, events, leads, and subscribers over the last 6 months.
                </p>
                <div className="wita-trend-list">
                  {dashboardData.trend.map((item) => {
                    const width =
                      trendMax > 0 ? Math.max(8, (item.total / trendMax) * 100) : 8;
                    return (
                      <div className="wita-trend-row" key={item.month}>
                        <p>{item.month}</p>
                        <div className="wita-trend-bar-wrap">
                          <span className="wita-trend-bar" style={{ width: `${width}%` }} />
                        </div>
                        <p className="wita-trend-value">
                          {item.total} total ({item.news} news, {item.events} events,{" "}
                          {item.contacts} leads, {item.subscribers} subscribers)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="wita-admin-card">
                <h2>News Category Split</h2>
                <p className="wita-admin-muted">Breakdown of published stories by category.</p>
                {dashboardData.newsByCategory.length === 0 ? (
                  <p>No categories yet.</p>
                ) : (
                  <ul className="wita-admin-metric-list">
                    {dashboardData.newsByCategory.map((item) => (
                      <li key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            <div className="wita-admin-latest-grid">
              <Card className="wita-admin-card">
                <h2>Latest Contact Leads</h2>
                {dashboardData.latestContacts.length === 0 ? (
                  <p>No contact submissions yet.</p>
                ) : (
                  <ul className="wita-admin-feed">
                    {dashboardData.latestContacts.map((item) => (
                      <li key={item.id}>
                        <p>
                          <strong>{item.fullName}</strong> ({item.email})
                        </p>
                        <p>{item.organization || "No organization provided"}</p>
                        <p>{item.message}</p>
                        <small>{formatDate(item.createdAt)}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card className="wita-admin-card">
                <h2>Latest Subscribers</h2>
                {dashboardData.latestSubscribers.length === 0 ? (
                  <p>No subscribers yet.</p>
                ) : (
                  <ul className="wita-admin-feed">
                    {dashboardData.latestSubscribers.map((item) => (
                      <li key={item.id}>
                        <p>
                          <strong>{item.email}</strong>
                        </p>
                        <small>{formatDate(item.createdAt)}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </>
        ) : null}
      </>
    );
  }

  function renderNewsManager() {
    return (
      <>
        <Card className="wita-admin-card">
          <h2>Create News Item</h2>
          <form className="wita-admin-form" onSubmit={handleCreateNews}>
            <Input
              placeholder="Date (e.g. January 11, 2025)"
              value={newsForm.date}
              onChange={(event) =>
                setNewsForm((current) => ({ ...current, date: event.target.value }))
              }
            />
            <Input
              placeholder="Category"
              value={newsForm.category}
              onChange={(event) =>
                setNewsForm((current) => ({ ...current, category: event.target.value }))
              }
            />
            <Input
              placeholder="Title"
              value={newsForm.title}
              onChange={(event) =>
                setNewsForm((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
            <Textarea
              placeholder="Summary"
              value={newsForm.summary}
              onChange={(event) =>
                setNewsForm((current) => ({ ...current, summary: event.target.value }))
              }
              required
            />
            <Textarea
              placeholder="Excerpt (optional)"
              value={newsForm.excerpt}
              onChange={(event) =>
                setNewsForm((current) => ({ ...current, excerpt: event.target.value }))
              }
            />
            <Button type="submit">Publish News</Button>
          </form>
        </Card>

        <div className="wita-admin-list">
          {newsLoading ? <p>Loading news...</p> : null}
          {!newsLoading && newsItems.length === 0 ? (
            <Card className="wita-admin-card">
              <p>No news items found.</p>
            </Card>
          ) : null}

          {newsItems.map((item) => (
            <Card key={item.id} className="wita-admin-card">
              {editingNewsId === item.id ? (
                <div className="wita-admin-form">
                  <Input
                    value={editingNewsForm.date}
                    onChange={(event) =>
                      setEditingNewsForm((current) => ({ ...current, date: event.target.value }))
                    }
                  />
                  <Input
                    value={editingNewsForm.category}
                    onChange={(event) =>
                      setEditingNewsForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                  />
                  <Input
                    value={editingNewsForm.title}
                    onChange={(event) =>
                      setEditingNewsForm((current) => ({ ...current, title: event.target.value }))
                    }
                  />
                  <Textarea
                    value={editingNewsForm.summary}
                    onChange={(event) =>
                      setEditingNewsForm((current) => ({
                        ...current,
                        summary: event.target.value
                      }))
                    }
                  />
                  <Textarea
                    value={editingNewsForm.excerpt}
                    onChange={(event) =>
                      setEditingNewsForm((current) => ({
                        ...current,
                        excerpt: event.target.value
                      }))
                    }
                  />
                  <div className="wita-admin-actions">
                    <Button type="button" onClick={() => handleUpdateNews(item.id)}>
                      Save
                    </Button>
                    <button
                      type="button"
                      className="wita-admin-link"
                      onClick={() => {
                        setEditingNewsId("");
                        setEditingNewsForm(emptyNewsForm);
                      }}
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
                    <Button
                      type="button"
                      variant="dark"
                      onClick={() => {
                        setEditingNewsId(item.id);
                        setEditingNewsForm({
                          date: item.date || "",
                          category: item.category || "",
                          title: item.title || "",
                          summary: item.summary || "",
                          excerpt: item.excerpt || ""
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      className="wita-admin-delete"
                      onClick={() => handleDeleteNews(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </>
    );
  }

  function renderEventsManager() {
    return (
      <>
        <Card className="wita-admin-card">
          <h2>Create Event</h2>
          <form className="wita-admin-form" onSubmit={handleCreateEvent}>
            <Input
              placeholder="Day (e.g. 11)"
              value={eventForm.day}
              onChange={(event) =>
                setEventForm((current) => ({ ...current, day: event.target.value }))
              }
              required
            />
            <Input
              placeholder="Month (e.g. Apr)"
              value={eventForm.month}
              onChange={(event) =>
                setEventForm((current) => ({ ...current, month: event.target.value }))
              }
              required
            />
            <Input
              placeholder="Title"
              value={eventForm.title}
              onChange={(event) =>
                setEventForm((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
            <Input
              placeholder="Schedule"
              value={eventForm.schedule}
              onChange={(event) =>
                setEventForm((current) => ({ ...current, schedule: event.target.value }))
              }
              required
            />
            <Input
              placeholder="Venue"
              value={eventForm.venue}
              onChange={(event) =>
                setEventForm((current) => ({ ...current, venue: event.target.value }))
              }
              required
            />
            <Button type="submit">Create Event</Button>
          </form>
        </Card>

        <div className="wita-admin-list">
          {eventsLoading ? <p>Loading events...</p> : null}
          {!eventsLoading && eventItems.length === 0 ? (
            <Card className="wita-admin-card">
              <p>No events found.</p>
            </Card>
          ) : null}

          {eventItems.map((item) => (
            <Card key={item.id} className="wita-admin-card">
              {editingEventId === item.id ? (
                <div className="wita-admin-form">
                  <Input
                    value={editingEventForm.day}
                    onChange={(event) =>
                      setEditingEventForm((current) => ({ ...current, day: event.target.value }))
                    }
                  />
                  <Input
                    value={editingEventForm.month}
                    onChange={(event) =>
                      setEditingEventForm((current) => ({
                        ...current,
                        month: event.target.value
                      }))
                    }
                  />
                  <Input
                    value={editingEventForm.title}
                    onChange={(event) =>
                      setEditingEventForm((current) => ({
                        ...current,
                        title: event.target.value
                      }))
                    }
                  />
                  <Input
                    value={editingEventForm.schedule}
                    onChange={(event) =>
                      setEditingEventForm((current) => ({
                        ...current,
                        schedule: event.target.value
                      }))
                    }
                  />
                  <Input
                    value={editingEventForm.venue}
                    onChange={(event) =>
                      setEditingEventForm((current) => ({
                        ...current,
                        venue: event.target.value
                      }))
                    }
                  />
                  <div className="wita-admin-actions">
                    <Button type="button" onClick={() => handleUpdateEvent(item.id)}>
                      Save
                    </Button>
                    <button
                      type="button"
                      className="wita-admin-link"
                      onClick={() => {
                        setEditingEventId("");
                        setEditingEventForm(emptyEventForm);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="wita-news-date">
                    {item.day} {item.month}
                  </p>
                  <h3>{item.title}</h3>
                  <p>{item.schedule}</p>
                  <p>{item.venue}</p>
                  <div className="wita-admin-actions">
                    <Button
                      type="button"
                      variant="dark"
                      onClick={() => {
                        setEditingEventId(item.id);
                        setEditingEventForm({
                          day: item.day || "",
                          month: item.month || "",
                          title: item.title || "",
                          schedule: item.schedule || "",
                          venue: item.venue || ""
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      className="wita-admin-delete"
                      onClick={() => handleDeleteEvent(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </>
    );
  }

  function renderGalleryManager() {
    return (
      <>
        <Card className="wita-admin-card">
          <h2>Upload Image</h2>
          <form className="wita-admin-form" onSubmit={handleUploadImage}>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setSelectedFile(file);
              }}
              required
            />
            <Input
              placeholder="Caption (optional)"
              value={galleryCaption}
              onChange={(event) => setGalleryCaption(event.target.value)}
            />
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </form>
        </Card>

        <div className="wita-admin-gallery-grid">
          {galleryLoading ? <p>Loading gallery...</p> : null}
          {!galleryLoading && galleryItems.length === 0 ? (
            <Card className="wita-admin-card">
              <p>No images uploaded yet.</p>
            </Card>
          ) : null}
          {galleryItems.map((item) => (
            <Card key={item.id} className="wita-admin-gallery-card">
              <img src={item.url} alt={item.caption || item.originalName} />
              <p>{item.caption || item.originalName}</p>
              <small>{formatDate(item.createdAt)}</small>
              <button
                type="button"
                className="wita-admin-delete"
                onClick={() => handleDeleteImage(item.id)}
              >
                Delete
              </button>
            </Card>
          ))}
        </div>
      </>
    );
  }

  function renderApiHealth() {
    return (
      <>
        <div className="wita-admin-top-actions">
          <Button type="button" onClick={loadHealth}>
            Run Health Checks
          </Button>
        </div>

        {healthLoading ? <p>Checking APIs...</p> : null}
        {healthError ? <p className="wita-admin-error">{healthError}</p> : null}

        {healthData ? (
          <>
            <Card className="wita-admin-card">
              <h2>API Health Summary</h2>
              <p>
                {healthData.summary.up} up / {healthData.summary.total} total checks
              </p>
              <p>
                {healthData.summary.down > 0
                  ? `${healthData.summary.down} checks need attention.`
                  : "All checks passing."}
              </p>
              <small>{formatDate(healthData.generatedAt)}</small>
            </Card>

            <div className="wita-api-health-grid">
              {healthData.checks.map((item) => (
                <Card
                  key={item.key}
                  className={`wita-admin-card ${
                    item.status === "up" ? "wita-health-up" : "wita-health-down"
                  }`}
                >
                  <p className="wita-news-tag">{item.label}</p>
                  <h3>{item.status === "up" ? "Live" : "Down"}</h3>
                  <p>{item.message}</p>
                </Card>
              ))}
            </div>
          </>
        ) : null}
      </>
    );
  }

  return (
    <section className="wita-admin-page">
      <div className="container">
        <div className="wita-page-head">
          <p className="eyebrow">Backend Dashboard</p>
          <h1>WITA Admin Control Center</h1>
          <p>
            Manage content, events, gallery assets, platform health, and KPI insights
            from one secure dashboard.
          </p>
        </div>

        <div className="wita-admin-shell">
          <aside className="wita-admin-sidebar">
            <div className="wita-admin-sidebar-head">
              <h2>Admin Menu</h2>
            </div>
            <nav className="wita-admin-nav">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`wita-admin-nav-item ${
                    activeSection === item.key ? "is-active" : ""
                  }`}
                  onClick={() => setActiveSection(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <Button
              type="button"
              variant="ghost"
              className="wita-admin-signout"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              Sign Out
            </Button>
          </aside>

          <div className="wita-admin-content">
            {globalStatus ? <p className="wita-admin-status">{globalStatus}</p> : null}

            {activeSection === "kpis" ? renderKpis() : null}
            {activeSection === "news" ? renderNewsManager() : null}
            {activeSection === "events" ? renderEventsManager() : null}
            {activeSection === "gallery" ? renderGalleryManager() : null}
            {activeSection === "apis" ? renderApiHealth() : null}
          </div>
        </div>
      </div>
    </section>
  );
}
