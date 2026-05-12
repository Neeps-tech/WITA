import Navbar from "@/components/wita/Navbar";
import Footer from "@/components/wita/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
