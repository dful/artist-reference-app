import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import { useLightReferenceStore, sphericalToCartesian } from '../../stores/lightReferenceStore';
import { BUILT_IN_MODELS } from '../../utils/constants';

const LightHelper = ({ position, color, enabled }) => {
  if (!enabled) return null;

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const SceneLights = () => {
  const lights = useLightReferenceStore((state) => state.lights);
  const ambient = useLightReferenceStore((state) => state.ambient);
  const showHelpers = useLightReferenceStore((state) => state.showHelpers);

  const keyPos = sphericalToCartesian(
    lights.key.position.azimuth,
    lights.key.position.elevation,
    lights.key.position.distance
  );
  const fillPos = sphericalToCartesian(
    lights.fill.position.azimuth,
    lights.fill.position.elevation,
    lights.fill.position.distance
  );
  const rimPos = sphericalToCartesian(
    lights.rim.position.azimuth,
    lights.rim.position.elevation,
    lights.rim.position.distance
  );

  return (
    <>
      {/* Ambient light */}
      <ambientLight color={ambient.color} intensity={ambient.intensity} />

      {/* Key light */}
      {lights.key.enabled && (
        <spotLight
          position={[keyPos.x, keyPos.y, keyPos.z]}
          color={lights.key.color}
          intensity={lights.key.intensity * 100}
          angle={0.5}
          penumbra={0.5}
          castShadow
        />
      )}
      {showHelpers && lights.key.enabled && (
        <LightHelper position={[keyPos.x, keyPos.y, keyPos.z]} color={lights.key.color} enabled />
      )}

      {/* Fill light */}
      {lights.fill.enabled && (
        <spotLight
          position={[fillPos.x, fillPos.y, fillPos.z]}
          color={lights.fill.color}
          intensity={lights.fill.intensity * 100}
          angle={0.6}
          penumbra={0.7}
        />
      )}
      {showHelpers && lights.fill.enabled && (
        <LightHelper position={[fillPos.x, fillPos.y, fillPos.z]} color={lights.fill.color} enabled />
      )}

      {/* Rim light */}
      {lights.rim.enabled && (
        <spotLight
          position={[rimPos.x, rimPos.y, rimPos.z]}
          color={lights.rim.color}
          intensity={lights.rim.intensity * 100}
          angle={0.4}
          penumbra={0.3}
        />
      )}
      {showHelpers && lights.rim.enabled && (
        <LightHelper position={[rimPos.x, rimPos.y, rimPos.z]} color={lights.rim.color} enabled />
      )}
    </>
  );
};

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 2, 1]} />
    <meshStandardMaterial color="#666" wireframe />
  </mesh>
);

export const Scene3D = ({ className = '' }) => {
  const selectedModelId = useLightReferenceStore((state) => state.selectedModelId);

  // Preload all built-in models on mount
  useEffect(() => {
    Object.values(BUILT_IN_MODELS).forEach((model) => {
      if (model.path) {
        useGLTF.preload(model.path);
      }
    });
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />

        <Suspense fallback={<LoadingFallback />}>
          <SceneLights />
          <HumanModel modelId={selectedModelId} />
        </Suspense>

        {/* Floor for reference */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
          <circleGeometry args={[3, 64]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
        </mesh>

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
