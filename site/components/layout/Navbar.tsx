"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import { Logo } from "./Logo";
import { TopBar } from "./TopBar";

const links = [
  ["Ana Sayfa", "/"],
  ["Satılık Araçlar", "/araclar"],
  ["Blog", "/blog"],
  ["SSS", "/sss"],
  ["Hakkımızda", "/hakkimizda"],
  ["İletişim", "/iletisim"],
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 12;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <TopBar />
      <div className="navbar">
        <Logo />
        <nav className={`nav-links ${open ? "nav-links--open" : ""}`} aria-label="Ana navigasyon">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link className="nav-links__cta" href="/arac-degerleme?new=1" onClick={() => setOpen(false)}>Aracımı Değerle</Link>
        </nav>
        <Link className="appointment" href="/arac-degerleme?new=1">Aracımı Değerle</Link>
        <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
