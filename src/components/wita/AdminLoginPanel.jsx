"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPanel({ error, oauthReady = true, bypassEnabled = false }) {
  const message =
    error === "AccessDenied"
      ? "Your account is authenticated, but not authorized for this admin portal."
      : "";

  return (
    <section className="wita-admin-page">
      <div className="container">
        <div className="wita-page-head">
          <p className="eyebrow">Admin Login</p>
          <h1>Secure Admin Access</h1>
          <p>Sign in with your approved OAuth account to access WITA admin tools.</p>
        </div>

        {bypassEnabled ? (
          <p className="wita-inline-error">
            Local development bypass is enabled. Admin OAuth checks are temporarily skipped on localhost.
          </p>
        ) : (
          <div className="wita-admin-top-actions">
            <Button
              type="button"
              disabled={!oauthReady}
              onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
            >
              Continue With Google
            </Button>
          </div>
        )}

        {!oauthReady && !bypassEnabled ? (
          <p className="wita-inline-error">
            OAuth is not configured yet. Update <code>.env.local</code> with real
            values for <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>,
            and <code>NEXTAUTH_SECRET</code>, then restart the dev server.
          </p>
        ) : null}

        {message ? <p className="wita-inline-error">{message}</p> : null}
      </div>
    </section>
  );
}
