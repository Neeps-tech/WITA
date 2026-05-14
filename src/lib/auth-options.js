import GoogleProvider from "next-auth/providers/google";

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getAdminAllowlist() {
  const raw = process.env.WITA_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

export function isAdminEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return false;
  }
  return getAdminAllowlist().includes(normalized);
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async signIn({ user }) {
      return isAdminEmail(user?.email);
    },
    async session({ session }) {
      if (!session?.user) {
        return session;
      }

      const email = normalizeEmail(session.user.email);
      session.user.email = email;
      session.user.isAdmin = isAdminEmail(email);
      return session;
    }
  }
};
