import SiteLayout from "@/components/wita/SiteLayout";
import News from "@/views/News";

export const dynamic = "force-dynamic";

export default function NewsPage() {
  return (
    <SiteLayout>
      <News />
    </SiteLayout>
  );
}
