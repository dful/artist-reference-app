import { forwardRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { PoseModel } from './PoseModel';

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[0.5, 1.5, 0.5]} />
    <meshStandardMaterial color="#666" wireframe />
  </mesh>
);

const SceneContent = forwardRef(({ modelPath }, ref) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.4}
      />

      {/* Environment for better reflections */}
      <Environment preset="studio" />

      {/* Ground grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6b7280"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#374151"
        fadeDistance={10}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {/* Contact shadow for grounding */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Model */}
      <group position={[0, 0, 0]}>
        <Suspense fallback={<LoadingFallback />}>
          <PoseModel ref={ref} modelPath={modelPath} />
        </Suspense>
      </group>

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        minDistance={1}
        maxDistance={10}
        enablePan={true}
        panSpeed={0.5}
        target={[0, 1, 0]}
      />
    </>
  );
});

SceneContent.displayName = 'SceneContent';

export const PoseScene = forwardRef(({ modelPath, className }, ref) => {
  return (
    <Canvas
      className={className}
      camera={{ position: [2.5, 1.5, 2.5], fov: 50 }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
    >
      <color attach="background" args={['#1a1a2e']} />
      <SceneContent ref={ref} modelPath={modelPath} />
    </Canvas>
  );
});

PoseScene.displayName = 'PoseScene';
