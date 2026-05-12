"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="wita-nav-shell">
      <div className="container wita-nav">
        <Link href="/" className="wita-logo-wrap" onClick={() => setOpen(false)}>
          <Image
            src="/images/wita-logo.png"
            alt="Women In Tourism Africa"
            width={96}
            height={38}
            priority
          />
        </Link>

        <nav className="wita-nav-links" aria-label="Main navigation">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("wita-nav-link", active && "is-active")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="wita-menu-btn"
          onClick={() => setOpen((state) => !state)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="wita-mobile-menu">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("wita-mobile-link", active && "is-active")}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
