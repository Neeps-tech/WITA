import { redirect } from "next/navigation";
import { requireAdminPageSession } from "@/lib/admin-auth";

export default async function AdminHomePage() {
  await requireAdminPageSession();
  redirect("/admin/dashboard");
}
