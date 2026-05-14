import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, isAdminEmail } from "@/lib/auth-options";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isTrueFlag(value) {
  return value === "1" || value === "true";
}

function isLocalNextAuthUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return LOCAL_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function isLocalDevAdminBypassEnabled() {
  const devMode = process.env.NODE_ENV !== "production";
  const bypassFlag = isTrueFlag(String(process.env.WITA_DEV_BYPASS_ADMIN || "").toLowerCase());
  const localBaseUrl = isLocalNextAuthUrl(process.env.NEXTAUTH_URL);
  return devMode && bypassFlag && localBaseUrl;
}

export async function getAdminSession() {
  if (isLocalDevAdminBypassEnabled()) {
    return {
      user: {
        name: "Local Dev Admin",
        email: "local-dev-admin@localhost",
        isAdmin: true
      },
      expires: "9999-12-31T23:59:59.999Z",
      localBypass: true
    };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  if (!isAdminEmail(session.user.email)) {
    return null;
  }

  return session;
}

export async function requireAdminPageSession() {
  const session = await getAdminSession();
  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect("/admin/login");
  }
  return session;
}

export async function requireAdminApiSession() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}
