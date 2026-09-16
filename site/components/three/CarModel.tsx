"use client";
import { Clone, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
export function CarModel({ onReady }: { onReady: () => void }) {
  const gltf = useGLTF("/models/car.glb", true);
  useEffect(() => onReady(), [onReady]);
  return <group position={[0, -0.72, 0]} rotation={[0, -0.55, 0]}><Clone object={gltf.scene} scale={1.45} castShadow receiveShadow /></group>;
}
