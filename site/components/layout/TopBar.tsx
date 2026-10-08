import { Mail } from "lucide-react";
import Link from "@/components/layout/NativeLink";

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__inner">
        <div className="topbar__contact">
          <a href="mailto:info@dcars.tr"><Mail size={13} /><span>info@dcars.tr</span></a>
        </div>
        <div className="topbar__social">
          <a href="https://www.instagram.com/dcars.tr?stkn=MWZyNnRyNms2d2tmeQ==" target="_blank" rel="noopener noreferrer" aria-label="D CARS Instagram">
            <span>Instagram</span>
          </a>
          <Link href="/iletisim">Bilgi ve randevu</Link>
        </div>
      </div>
    </div>
  );
}
