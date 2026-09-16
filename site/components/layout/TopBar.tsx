import { Mail } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return <div className="topbar"><div className="topbar__contact"><a href="mailto:info@dcars.tr"><Mail size={13} /><span>info@dcars.tr</span></a></div><div className="topbar__social"><Link href="/iletisim">Bilgi ve randevu</Link></div></div>;
}
