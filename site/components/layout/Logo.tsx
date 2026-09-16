import Link from "next/link";

export function Logo() {
  return <Link className="brand-mark" href="/" aria-label="D Cars ana sayfa"><span className="brand-mark__symbol">D</span><span className="brand-mark__type"><strong>D Cars</strong><small>Premium Auto Gallery</small></span></Link>;
}
