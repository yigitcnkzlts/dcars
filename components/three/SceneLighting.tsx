import { Environment, Lightformer } from "@react-three/drei";
export function SceneLighting() {
  return <><ambientLight intensity={0.35} /><directionalLight castShadow position={[4, 7, 5]} intensity={2.4} color="#fff5e6" shadow-mapSize={[1024, 1024]} /><spotLight position={[-5, 4, 2]} intensity={24} angle={0.4} penumbra={0.9} color="#c9a978" /><Environment resolution={256}><Lightformer intensity={4} position={[0, 5, -4]} scale={[10, 2, 1]} /><Lightformer intensity={3} position={[5, 1, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 2, 1]} color="#d7bb8e" /><Lightformer intensity={2} position={[-5, 2, 1]} rotation={[0, Math.PI / 2, 0]} scale={[4, 3, 1]} /></Environment></>;
}
