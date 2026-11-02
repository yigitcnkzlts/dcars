"use client";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, PerspectiveCamera, useProgress } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useState } from "react";
import { CarModel } from "./CarModel";
import { SceneLighting } from "./SceneLighting";

function Progress() { const { progress } = useProgress(); return <div className="model-progress"><span style={{ width: `${progress}%` }} /><small>{Math.round(progress)}%</small></div>; }

export function CarShowroom() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [interacting, setInteracting] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/models/car.glb", { method: "HEAD", signal: controller.signal }).then((r) => setAvailable(r.ok)).catch(() => setAvailable(false));
    return () => controller.abort();
  }, []);
  if (available === null) return <div className="showroom-loading"><span className="showroom-loading__line" /><span>MODEL KONTROL EDİLİYOR</span></div>;
  if (!available) return <div className="showroom-fallback"><Image src="/images/q8-cutout.png" alt="Siyah Audi Q8" fill priority sizes="(max-width: 900px) 100vw, 58vw" /></div>;
  return (
    <div className="showroom-canvas" onPointerDown={() => setInteracting(true)} onPointerUp={() => setInteracting(false)} onPointerLeave={() => setInteracting(false)}>
      {!ready && <Progress />}
      <Canvas dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[6, 2.2, 6.8]} fov={38} />
        <Suspense fallback={null}><SceneLighting /><CarModel onReady={onReady} /><ContactShadows position={[0, -0.78, 0]} opacity={0.42} scale={9} blur={2.8} far={4} /></Suspense>
        <OrbitControls enablePan={false} autoRotate={!interacting} autoRotateSpeed={0.45} minDistance={5.8} maxDistance={10} minPolarAngle={Math.PI / 3.1} maxPolarAngle={Math.PI / 2.05} target={[0, 0.15, 0]} enableDamping dampingFactor={0.06} />
      </Canvas>
    </div>
  );
}
