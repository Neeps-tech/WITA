import SiteLayout from "@/components/wita/SiteLayout";
import AdminDashboard from "@/components/wita/AdminDashboard";
import { requireAdminPageSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminPageSession();

  return (
    <SiteLayout>
      <AdminDashboard />
    </SiteLayout>
  );
}
