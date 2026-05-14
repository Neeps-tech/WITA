"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load dashboard metrics.");
      }

      setData(payload);
    } catch (requestError) {
      setError(requestError.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const trendMax = useMemo(() => toMaxValue(data?.trend || []), [data?.trend]);

  return (
    <section className="wita-admin-page">
      <div className="container">
        <div className="wita-page-head">
          <p className="eyebrow">Backend Dashboard</p>
          <h1>WITA KPI & Metrics Overview</h1>
          <p>
            Monitor content publishing, inbound leads, newsletter growth, and
            monthly engagement in one place.
          </p>
        </div>

        <div className="wita-admin-top-actions">
          <Link href="/admin/news">
            <Button type="button" variant="dark">
              Manage News
            </Button>
          </Link>
          <Button type="button" onClick={loadDashboard}>
            Refresh Metrics
          </Button>
        </div>

        {loading ? <p>Loading dashboard...</p> : null}
        {error ? <p className="wita-admin-error">{error}</p> : null}

        {!loading && !error && data ? (
          <>
            <div className="wita-kpi-grid">
              {data.kpis.map((item) => (
                <Card key={item.key} className="wita-kpi-card">
                  <p className="wita-kpi-label">{item.label}</p>
                  <p className="wita-kpi-value">{item.value}</p>
                  <p className="wita-kpi-helper">{item.helper}</p>
                </Card>
              ))}
            </div>

            <div className="wita-admin-insights">
              <Card className="wita-admin-card">
                <h2>Monthly Engagement Trend</h2>
                <p className="wita-admin-muted">
                  Combined activity from news publishing, contact leads, and
                  newsletter growth over the last 6 months.
                </p>
                <div className="wita-trend-list">
                  {data.trend.map((item) => {
                    const width =
                      trendMax > 0 ? Math.max(8, (item.total / trendMax) * 100) : 8;
                    return (
                      <div className="wita-trend-row" key={item.month}>
                        <p>{item.month}</p>
                        <div className="wita-trend-bar-wrap">
                          <span
                            className="wita-trend-bar"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <p className="wita-trend-value">
                          {item.total} total ({item.news} news, {item.contacts} leads,{" "}
                          {item.subscribers} subscribers)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="wita-admin-card">
                <h2>News Category Split</h2>
                <p className="wita-admin-muted">
                  Breakdown of currently published stories by category.
                </p>
                {data.newsByCategory.length === 0 ? (
                  <p>No categories yet.</p>
                ) : (
                  <ul className="wita-admin-metric-list">
                    {data.newsByCategory.map((item) => (
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
                {data.latestContacts.length === 0 ? (
                  <p>No contact submissions yet.</p>
                ) : (
                  <ul className="wita-admin-feed">
                    {data.latestContacts.map((item) => (
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
                <h2>Latest Newsletter Signups</h2>
                {data.latestSubscribers.length === 0 ? (
                  <p>No subscribers yet.</p>
                ) : (
                  <ul className="wita-admin-feed">
                    {data.latestSubscribers.map((item) => (
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

            <Card className="wita-admin-card">
              <h2>Latest Published News</h2>
              {data.latestNews.length === 0 ? (
                <p>No news published yet.</p>
              ) : (
                <ul className="wita-admin-feed">
                  {data.latestNews.map((item) => (
                    <li key={item.id}>
                      <p>
                        <strong>{item.title}</strong>
                      </p>
                      <p>{item.category || "General"}</p>
                      <small>{item.date || formatDate(item.createdAt)}</small>
                    </li>
                  ))}
                </ul>
              )}
              <p className="wita-admin-meta">
                Last generated: {formatDate(data.generatedAt)}
              </p>
            </Card>
          </>
        ) : null}
      </div>
    </section>
  );
}
