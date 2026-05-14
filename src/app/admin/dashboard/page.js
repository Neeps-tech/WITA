import SiteLayout from "@/components/wita/SiteLayout";
import AdminDashboard from "@/components/wita/AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <SiteLayout>
      <AdminDashboard />
    </SiteLayout>
  );
}
