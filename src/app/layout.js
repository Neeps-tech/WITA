import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  metadataBase: new URL("https://womenintourismafrica.com"),
  title: "WITA | Women In Tourism Africa",
  description:
    "Women In Tourism Africa empowers women leaders and entrepreneurs across the tourism value chain.",
  icons: {
    icon: "/images/wita-logo.png",
  },
  openGraph: {
    title: "WITA | Women In Tourism Africa",
    description:
      "Empowering women leaders and entrepreneurs across the African tourism value chain.",
    url: "https://womenintourismafrica.com",
    siteName: "Women In Tourism Africa",
    images: [
      {
        url: "/images/wita-logo.png",
        width: 1200,
        height: 630,
        alt: "WITA Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WITA | Women In Tourism Africa",
    description:
      "Empowering women leaders and entrepreneurs across the African tourism value chain.",
    images: ["/images/wita-logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable}`}>{children}</body>
    </html>
  );
}
