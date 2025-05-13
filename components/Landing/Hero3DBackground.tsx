import { Canvas } from '@react-three/fiber';
import { Float, Environment, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Dumbbell({ position = [0, 0, 0], color = '#FFD600' }) {
  // Dumbbell: two spheres and a cylinder
  return (
    <group position={position}>
      {/* Handle */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 32]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Left weight */}
      <mesh position={[-0.45, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={'#fff'} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right weight */}
      <mesh position={[0.45, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={'#fff'} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function Kettlebell({ position = [0, 0, 0], color = '#A259FF' }) {
  // Kettlebell: sphere + torus handle
  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.16, 0.045, 16, 100]} />
        <meshStandardMaterial color={'#fff'} metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 2]} intensity={1.2} castShadow />
        <Environment preset="city" />
        {/* Floating Dumbbells */}
        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
          <Dumbbell position={[-0.8, 0.3, 0]} color="#FFD600" />
        </Float>
        <Float speed={1.1} rotationIntensity={0.7} floatIntensity={0.6}>
          <Dumbbell position={[0.7, -0.2, 0.2]} color="#FF6F61" />
        </Float>
        {/* Floating Kettlebells */}
        <Float speed={1.3} rotationIntensity={0.6} floatIntensity={0.8}>
          <Kettlebell position={[0.2, 0.7, -0.3]} color="#A259FF" />
        </Float>
        <Float speed={1.05} rotationIntensity={0.4} floatIntensity={0.5}>
          <Kettlebell position={[-0.5, -0.5, 0.1]} color="#43E97B" />
        </Float>
        {/* Optionally add more objects for richness */}
        {/* <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /> */}
      </Canvas>
    </div>
  );
} 