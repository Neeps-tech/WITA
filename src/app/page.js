import SiteLayout from "@/components/wita/SiteLayout";
import Home from "@/views/Home";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <SiteLayout>
      <Home />
    </SiteLayout>
  );
}
