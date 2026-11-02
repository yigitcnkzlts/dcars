"use client";

import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { VehicleImage } from "@/lib/demoVehicles";

export function VehicleGallery({ title, images }: { title: string; images: VehicleImage[] }) {
  const [active, setActive] = useState(0);
  const image = images[active];
  const move = (direction: number) => setActive((current) => (current + direction + images.length) % images.length);
  return <section className="vehicle-gallery" aria-label={`${title} fotoğraf galerisi`}>
    <div className="vehicle-gallery__main">
      {image.url ? <Image src={image.url} alt={image.alt} fill priority={active === 0} sizes="(max-width: 900px) 100vw, 65vw" /> : <div className="vehicle-gallery__empty"><Camera size={42} /><strong>{image.label}</strong><span>Görsel panelden eklenecek</span></div>}
      <span className="vehicle-gallery__counter">{active + 1} / {images.length}</span>
      <button type="button" className="vehicle-gallery__previous" onClick={() => move(-1)} aria-label="Önceki görsel"><ChevronLeft /></button>
      <button type="button" className="vehicle-gallery__next" onClick={() => move(1)} aria-label="Sonraki görsel"><ChevronRight /></button>
    </div>
    <div className="vehicle-gallery__thumbs" role="list" aria-label="Galeri görselleri">{images.map((item, index) => <button type="button" role="listitem" key={`${item.label}-${index}`} aria-label={`${index + 1}. görsel: ${item.label}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)}>{item.url ? <Image src={item.url} alt="" fill sizes="90px" /> : <Camera size={18} />}<span>{index + 1}</span></button>)}</div>
  </section>;
}
