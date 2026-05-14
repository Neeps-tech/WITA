import { redirect } from "next/navigation";
import { requireAdminPageSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewsAdminPage() {
  await requireAdminPageSession();
  redirect("/admin/dashboard");
}
