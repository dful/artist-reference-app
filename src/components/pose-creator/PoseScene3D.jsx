import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { PosableModel } from './PosableModel';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { BUILT_IN_POSABLE_MODELS } from '../../utils/constants';

// Preload built-in models
Object.values(BUILT_IN_POSABLE_MODELS).forEach((model) => {
  if (model.path) {
    // FBX models are loaded dynamically, not preloaded via useGLTF
  }
});

const SceneLights = () => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />

      {/* Key light - main illumination with shadows */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Fill light - soften shadows */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />

      {/* Rim light - edge definition */}
      <directionalLight
        position={[0, 5, -10]}
        intensity={0.2}
      />
    </>
  );
};

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 2, 1]} />
    <meshStandardMaterial color="#666" wireframe />
  </mesh>
);

const FloorGrid = () => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>

      {/* Grid helper */}
      <gridHelper args={[6, 12, '#333', '#222']} />
    </group>
  );
};

export const PoseScene3D = ({ className = '' }) => {
  const canvasRef = useRef();
  const selectedModelId = usePoseCreatorStore((state) => state.selectedModelId);

  return (
    <div className={`w-full h-full ${className}`} ref={canvasRef}>
      <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />

        <Suspense fallback={<LoadingFallback />}>
          <SceneLights />
          <PosableModel modelId={selectedModelId} />
        </Suspense>

        <FloorGrid />

        <OrbitControls
          target={[0, 1, 0]}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI - 0.1}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};
