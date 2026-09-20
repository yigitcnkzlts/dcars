import { Navbar } from "./Navbar";

type Props = { eyebrow: string; title: string; updatedAt?: string; children: React.ReactNode };

export function LegalPage({ eyebrow, title, updatedAt = "11 Eylül 2026", children }: Props) {
  return <><Navbar /><main className="legal-page"><header><span>{eyebrow}</span><h1>{title}</h1><p>Son güncelleme: {updatedAt}</p></header><article>{children}</article></main></>;
}
