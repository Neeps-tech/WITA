"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/content";

const emptyForm = {
  fullName: "",
  email: "",
  organization: "",
  message: ""
};

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function onChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setError("");

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit message.");
      }

      setSubmitted(true);
      setForm(emptyForm);
    } catch (requestError) {
      setError(requestError.message || "Unable to submit message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="wita-page">
      <div className="container">
        <div className="wita-page-head reveal-up">
          <p className="eyebrow">Contact</p>
          <h1>Partner With Women In Tourism Africa</h1>
          <p>
            Reach out for partnerships, events, training, and collaboration
            opportunities that advance women in tourism and hospitality.
          </p>
        </div>

        <div className="wita-contact-grid">
          <Card className="reveal-up">
            <h2>Send Us A Message</h2>
            <form className="wita-contact-form" onSubmit={handleSubmit}>
              <Input
                placeholder="Full name"
                value={form.fullName}
                onChange={(event) => onChange("fullName", event.target.value)}
                required
              />
              <Input
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                required
              />
              <Input
                placeholder="Organization"
                value={form.organization}
                onChange={(event) => onChange("organization", event.target.value)}
              />
              <Textarea
                placeholder="Tell us how we can help"
                value={form.message}
                onChange={(event) => onChange("message", event.target.value)}
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
            {submitted && (
              <p className="wita-newsletter-status">
                Thank you. Your message has been received.
              </p>
            )}
            {error ? <p className="wita-inline-error">{error}</p> : null}
          </Card>

          <Card className="reveal-up delay-2">
            <h2>Contact Info</h2>
            {contactInfo.locations.map((loc) => (
              <div key={loc.country} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", color: "var(--wita-accent)", marginBottom: "0.25rem" }}>
                  {loc.country}
                </h3>
                <p>{loc.address}</p>
                <p>{loc.phone}</p>
              </div>
            ))}
            <p>{contactInfo.email}</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
