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
  title: "WITA | Women In Tourism Africa",
  description:
    "Women In Tourism Africa empowers women leaders and entrepreneurs across the tourism value chain.",
  icons: {
    icon: "/images/wita-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable}`}>{children}</body>
    </html>
  );
}
