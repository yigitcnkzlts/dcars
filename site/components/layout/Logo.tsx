import Link from "@/components/layout/NativeLink";

export function Logo() {
  return (
    <Link className="brand-mark" href="/" aria-label="D CARS ana sayfa">
      <span className="brand-mark__symbol">D</span>
      <span className="brand-mark__type">
        <strong>D CARS</strong>
        <small>Araç Değerleme</small>
      </span>
    </Link>
  );
}
