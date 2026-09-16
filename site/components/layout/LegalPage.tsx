import { Navbar } from "./Navbar";

type Props = { eyebrow: string; title: string; children: React.ReactNode };

export function LegalPage({ eyebrow, title, children }: Props) {
  return <><Navbar /><main className="legal-page"><header><span>{eyebrow}</span><h1>{title}</h1><p>Son güncelleme: 11 Eylül 2026</p></header><article>{children}</article></main></>;
}
