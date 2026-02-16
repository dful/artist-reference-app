import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useLightReferenceStore } from '../../stores/lightReferenceStore';
import { getModelData, createModelUrl } from '../../services/modelStorageService';
import { BUILT_IN_MODELS } from '../../utils/constants';

// Fallback primitive model when GLB is not available
const PrimitiveModel = () => {
  const meshRef = useRef();
  const autoRotate = useLightReferenceStore((state) => state.model.autoRotate);
  const rotation = useLightReferenceStore((state) => state.model.rotation);
  const scale = useLightReferenceStore((state) => state.model.scale);
  const position = useLightReferenceStore((state) => state.model.position) || { x: 0, y: 0, z: 0 };

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={[position.x, position.y, position.z]} rotation={[0, (rotation * Math.PI) / 180, 0]} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.25]} />
        <meshStandardMaterial color="#4a5568" roughness={0.6} />
      </mesh>
      {/* Hips */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.45, 0.2, 0.22]} />
        <meshStandardMaterial color="#4a5568" roughness={0.6} />
      </mesh>
      {/* Left arm */}
      <group position={[-0.35, 1.1, 0]}>
        <mesh position={[-0.15, -0.15, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
          <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
        </mesh>
        <mesh position={[-0.3, -0.55, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
          <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
        </mesh>
      </group>
      {/* Right arm */}
      <group position={[0.35, 1.1, 0]}>
        <mesh position={[0.15, -0.15, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
          <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
        </mesh>
        <mesh position={[0.3, -0.55, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
          <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
        </mesh>
      </group>
      {/* Left leg */}
      <group position={[-0.12, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color="#2d3748" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.75, 0]}>
          <capsuleGeometry args={[0.06, 0.4, 8, 16]} />
          <meshStandardMaterial color="#2d3748" roughness={0.7} />
        </mesh>
      </group>
      {/* Right leg */}
      <group position={[0.12, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color="#2d3748" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.75, 0]}>
          <capsuleGeometry args={[0.06, 0.4, 8, 16]} />
          <meshStandardMaterial color="#2d3748" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

// GLTF Model component - handles both built-in and custom models uniformly
const GLTFModel = ({ modelId }) => {
  const meshRef = useRef();
  const blobUrlRef = useRef(null);

  // Use state for the cloned scene (triggers re-renders)
  const [clonedScene, setClonedScene] = useState(null);

  // Get model info from store using proper selector that subscribes to changes
  const model = useLightReferenceStore((state) =>
    BUILT_IN_MODELS[modelId] ||
    state.customModels.find((m) => m.id === modelId) ||
    BUILT_IN_MODELS['human-base']
  );

  // Subscribe to store values
  const autoRotate = useLightReferenceStore((state) => state.model.autoRotate);
  const rotation = useLightReferenceStore((state) => state.model.rotation);
  const scale = useLightReferenceStore((state) => state.model.scale);
  const position = useLightReferenceStore((state) => state.model.position) || { x: 0, y: 0, z: 0 };

  // Debug: log store values on every render
  // console.log('[GLTFModel] Render:', {
  //   modelId,
  //   modelCategory: model?.category,
  //   positionY: position.y,
  //   sceneLoaded: !!clonedScene
  // });

  // Keep refs in sync for useFrame
  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Load model - either from path (built-in) or IndexedDB (custom)
  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        let loadedScene;

        if (model?.path) {
          const loader = new GLTFLoader();
          const gltf = await new Promise((resolve, reject) => {
            loader.load(model.path, resolve, undefined, reject);
          });
          loadedScene = gltf.scene;
        } else if (model?.category === 'custom') {
          const data = await getModelData(modelId);
          if (!data) {
            console.error('[GLTFModel] Model not found in IndexedDB:', modelId);
            return;
          }
          const url = createModelUrl(data);
          blobUrlRef.current = url;

          const loader = new GLTFLoader();
          const gltf = await new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
          });
          loadedScene = gltf.scene;
        } else {
          console.error('[GLTFModel] Invalid model configuration:', model);
          return;
        }

        if (isMounted) {
          const cloned = loadedScene.clone();
          // Disable frustum culling on all meshes to prevent disappearing when transformed
          cloned.traverse((child) => {
            if (child.isMesh) {
              child.frustumCulled = false;
            }
          });
          setClonedScene(cloned);
        }
      } catch (err) {
        console.error('[GLTFModel] Failed to load model:', err);
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [modelId]);

  // Calculate offsets when scene loads
  const { offset, normalizedScale } = useMemo(() => {
    if (!clonedScene) return { offset: { x: 0, y: 0, z: 0 }, normalizedScale: 1 };

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = 1.8 / maxDim;

    return {
      offset: {
        x: -center.x,
        y: -box.min.y,
        z: -center.z,
      },
      normalizedScale: normScale,
    };
  }, [clonedScene]);

  // Keep transform values in refs for useFrame
  const positionRef = useRef(position);
  const rotationRef = useRef(rotation);
  const scaleRef = useRef(scale);
  const offsetRef = useRef(offset);
  const normalizedScaleRef = useRef(normalizedScale);

  useEffect(() => {
    positionRef.current = position;
    rotationRef.current = rotation;
    scaleRef.current = scale;
    offsetRef.current = offset;
    normalizedScaleRef.current = normalizedScale;
  }, [position, rotation, scale, offset, normalizedScale]);

  // Apply transforms in useFrame to the GROUP, not the scene
  useFrame(() => {
    if (!meshRef.current) return;

    // Apply transforms to the GROUP
    // Position = user position + offset (to center and place feet at y=0)
    const finalScale = normalizedScaleRef.current * scaleRef.current;
    meshRef.current.position.set(
      positionRef.current.x + offsetRef.current.x,
      positionRef.current.y + offsetRef.current.y,
      positionRef.current.z + offsetRef.current.z
    );
    meshRef.current.rotation.y = (rotationRef.current * Math.PI) / 180;
    meshRef.current.scale.setScalar(finalScale);

    // Auto-rotate if enabled
    if (autoRotateRef.current) {
      meshRef.current.rotation.y += 0.016 * 0.5;
    }

    // Update matrices to fix frustum culling
    meshRef.current.updateMatrix();
    meshRef.current.updateMatrixWorld(true);
  });

  // Don't render until scene is loaded
  if (!clonedScene) {
    return null;
  }

  // Render the scene wrapped in a group
  // We apply transforms to the group, not the scene itself
  // This is important for rigged models where the skeleton might override scene transforms
  return (
    <group ref={meshRef}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Main HumanModel component - reads from store
export const HumanModel = ({ modelId }) => {
  // Use proper selector that subscribes to changes
  const model = useLightReferenceStore((state) =>
    BUILT_IN_MODELS[modelId] ||
    state.customModels.find((m) => m.id === modelId) ||
    null
  );

  // If no model found or no path/custom data, use primitive fallback
  if (!model || (!model.path && model.category !== 'custom')) {
    return <PrimitiveModel />;
  }

  // Both built-in and custom models use the same GLTFModel component
  return <GLTFModel modelId={modelId} />;
};

// Preload a model by path (for built-in models)
export const preloadModel = (modelPath) => {
  if (modelPath) {
    useGLTF.preload(modelPath);
  }
};
