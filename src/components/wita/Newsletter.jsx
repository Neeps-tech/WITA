"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/newsletter-subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Subscription failed.");
      }

      setStatus("Thanks for subscribing. You are now following WITA updates.");
      setEmail("");
    } catch (requestError) {
      setStatus(requestError.message || "Subscription failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="wita-newsletter">
      <div className="container wita-newsletter-inner reveal-up">
        <div>
          <p className="eyebrow">Newsletter</p>
          <h2>Follow Us For Tourism Leadership Insights Across Africa</h2>
        </div>

        <form className="wita-newsletter-form" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" variant="dark" disabled={submitting}>
            {submitting ? "Saving..." : "Follow"}
          </Button>
        </form>

        {status && <p className="wita-newsletter-status">{status}</p>}
      </div>
    </section>
  );
}
