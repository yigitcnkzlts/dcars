"use client";

import Link from "@/components/layout/NativeLink";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Logo() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  return (
    <div className="brand-mark">
      <button
        className="brand-mark__button"
        type="button"
        aria-label="D CARS logosunu büyüt"
        aria-expanded={expanded}
        onClick={() => setExpanded(true)}
      >
        <Image className="brand-mark__image" src="/images/dcars-logo-profile.png" alt="D CARS" width={52} height={52} priority />
      </button>
      <Link className="brand-mark__name" href="/" aria-label="D CARS ana sayfa">D-CARS</Link>
      {expanded ? (
        <button className="brand-logo-preview" type="button" aria-label="Büyütülmüş logoyu kapat" onClick={() => setExpanded(false)}>
          <Image src="/images/dcars-logo-profile.png" alt="D CARS logosu" width={520} height={520} priority />
        </button>
      ) : null}
    </div>
  );
}
