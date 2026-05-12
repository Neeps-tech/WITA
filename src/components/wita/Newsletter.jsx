"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.includes("@")) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setStatus("Thanks for subscribing. You are now following WITA updates.");
    setEmail("");
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
          <Button type="submit" variant="dark">
            Follow
          </Button>
        </form>

        {status && <p className="wita-newsletter-status">{status}</p>}
      </div>
    </section>
  );
}
