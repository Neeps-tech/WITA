import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SiteLayout from "@/components/wita/SiteLayout";
import AdminLoginPanel from "@/components/wita/AdminLoginPanel";
import { authOptions, isAdminEmail } from "@/lib/auth-options";
import { isLocalDevAdminBypassEnabled } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }) {
  const bypassEnabled = isLocalDevAdminBypassEnabled();
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";
  const hasGoogleId =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    !process.env.GOOGLE_CLIENT_ID.startsWith("replace-with-");
  const hasGoogleSecret =
    Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
    !process.env.GOOGLE_CLIENT_SECRET.startsWith("replace-with-");
  const hasNextAuthSecret =
    Boolean(process.env.NEXTAUTH_SECRET) &&
    !process.env.NEXTAUTH_SECRET.startsWith("replace-with-");
  const oauthReady = hasGoogleId && hasGoogleSecret && hasNextAuthSecret;

  if (bypassEnabled || (session && isAdminEmail(email))) {
    redirect("/admin/dashboard");
  }

  return (
    <SiteLayout>
      <AdminLoginPanel
        error={searchParams?.error || ""}
        oauthReady={oauthReady}
        bypassEnabled={bypassEnabled}
      />
    </SiteLayout>
  );
}
