import Link from "@/components/layout/NativeLink";
import Image from "next/image";

export function Logo() {
  return (
    <Link className="brand-mark" href="/" aria-label="D CARS ana sayfa">
      <Image className="brand-mark__image" src="/images/dcars-logo-profile.png" alt="D CARS" width={52} height={52} priority />
    </Link>
  );
}
