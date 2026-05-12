"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/content";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
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
              <Input placeholder="Full name" required />
              <Input placeholder="Email address" type="email" required />
              <Input placeholder="Organization" />
              <Textarea placeholder="Tell us how we can help" required />
              <Button type="submit">Send Message</Button>
            </form>
            {submitted && (
              <p className="wita-newsletter-status">
                Thank you. Your message has been received.
              </p>
            )}
          </Card>

          <Card className="reveal-up delay-2">
            <h2>Contact Info</h2>
            <p>{contactInfo.address}</p>
            <p>{contactInfo.phone}</p>
            <p>{contactInfo.email}</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
