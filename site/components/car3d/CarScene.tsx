"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Component, Suspense, type ReactNode } from "react";
import { CarModel } from "./CarModel";
import { Car3DFallback } from "./Car3DFallback";
import styles from "./Car3DViewer.module.css";

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Car3DFallback /> : this.props.children; }
}

export default function CarScene() {
  return (
    <SceneErrorBoundary>
      <div className={styles.canvas}>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [5.8, 2.9, 5.8], fov: 36, near: 0.1, far: 100 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <color attach="background" args={["#fafaf8"]} />
          <ambientLight intensity={1.15} />
          <hemisphereLight args={["#ffffff", "#d9d5cc", 1.2]} />
          <directionalLight position={[4, 8, 5]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
          <directionalLight position={[-5, 4, -3]} intensity={1.3} color="#e9edf5" />
          <Suspense fallback={null}>
            <CarModel />
            <ContactShadows position={[0, -0.015, 0]} opacity={0.32} scale={8} blur={2.8} far={4} resolution={256} />
          </Suspense>
          <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.07} minDistance={5.5} maxDistance={11} minPolarAngle={Math.PI / 3.8} maxPolarAngle={Math.PI / 2.05} target={[0, 0.8, 0]} rotateSpeed={0.65} zoomSpeed={0.55} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
