"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Box3, Vector3 } from "three";

export function CarModel() {
  const { scene } = useGLTF("/models/car.glb");
  const { model, scale, position } = useMemo(() => {
    const model = scene.clone(true);
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 4.4 / Math.max(size.x, size.y, size.z, 0.001);
    model.traverse((object) => {
      if ("isMesh" in object && object.isMesh) {
        const mesh = object as import("three").Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return { model, scale, position: [-center.x * scale, -bounds.min.y * scale, -center.z * scale] as [number, number, number] };
  }, [scene]);

  return <primitive object={model} scale={scale} position={position} />;
}
