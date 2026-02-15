import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useLightReferenceStore } from '../../stores/lightReferenceStore';
import { getModelData, createModelUrl, revokeModelUrl } from '../../services/modelStorageService';

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

// GLTF Model component for built-in models (loaded from file path)
const GLTFModel = ({ modelPath }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const autoRotate = useLightReferenceStore((state) => state.model.autoRotate);
  const rotation = useLightReferenceStore((state) => state.model.rotation);
  const scale = useLightReferenceStore((state) => state.model.scale);
  const position = useLightReferenceStore((state) => state.model.position) || { x: 0, y: 0, z: 0 };

  const { scene } = useGLTF(modelPath);

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Auto-center and normalize scale when scene loads
  useEffect(() => {
    if (scene && groupRef.current) {
      // Calculate bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Normalize scale to fit a standard height (~1.8 units)
      const maxDim = Math.max(size.x, size.y, size.z);
      const normalizedScale = 1.8 / maxDim;

      // Apply scale first to get correct bounding box
      scene.scale.setScalar(normalizedScale);

      // Recalculate box after scaling
      const scaledBox = new THREE.Box3().setFromObject(scene);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      const scaledSize = scaledBox.getSize(new THREE.Vector3());

      // Center on X and Z axes, but position bottom at y=0
      scene.position.x = -scaledCenter.x;
      scene.position.z = -scaledCenter.z;
      scene.position.y = -scaledBox.min.y; // Bottom of model at y=0
    }
  }, [scene]);

  // Clone the scene to avoid modifying the cached original
  const clonedScene = scene.clone();

  return (
    <group ref={meshRef} position={[position.x, position.y, position.z]} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      <group ref={groupRef}>
        <primitive object={clonedScene} scale={scale} position={[0, 0, 0]} />
      </group>
    </group>
  );
};

// Dynamic model component for custom models (loaded from IndexedDB)
const DynamicModel = ({ modelId }) => {
  const meshRef = useRef();
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(false);
  const modelUrlRef = useRef(null);

  const autoRotate = useLightReferenceStore((state) => state.model.autoRotate);
  const rotation = useLightReferenceStore((state) => state.model.rotation);
  const scale = useLightReferenceStore((state) => state.model.scale);
  const position = useLightReferenceStore((state) => state.model.position) || { x: 0, y: 0, z: 0 };

  // Load model data from IndexedDB
  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        const data = await getModelData(modelId);
        if (data && isMounted) {
          const url = createModelUrl(data);
          modelUrlRef.current = url;
          setModelUrl(url);
        } else if (isMounted) {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to load model:', err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    loadModel();

    // Cleanup: revoke blob URL
    return () => {
      isMounted = false;
      if (modelUrlRef.current) {
        revokeModelUrl(modelUrlRef.current);
        modelUrlRef.current = null;
      }
    };
  }, [modelId]);

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Show fallback if error or still loading
  if (error || !modelUrl) {
    return <PrimitiveModel />;
  }

  return <GLTFModelWithAutoCenter modelPath={modelUrl} meshRef={meshRef} rotation={rotation} scale={scale} position={position} />;
};

// Wrapper component that handles auto-centering and scaling for dynamic models
const GLTFModelWithAutoCenter = ({ modelPath, meshRef, rotation, scale, position }) => {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();

  // Auto-center and normalize scale
  useEffect(() => {
    if (scene && groupRef.current) {
      // Calculate bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());

      // Normalize scale to fit a standard height (~1.8 units)
      const maxDim = Math.max(size.x, size.y, size.z);
      const normalizedScale = 1.8 / maxDim;

      // Apply scale first to get correct bounding box
      scene.scale.setScalar(normalizedScale);

      // Recalculate box after scaling
      const scaledBox = new THREE.Box3().setFromObject(scene);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

      // Center on X and Z axes, but position bottom at y=0
      scene.position.x = -scaledCenter.x;
      scene.position.z = -scaledCenter.z;
      scene.position.y = -scaledBox.min.y; // Bottom of model at y=0
    }
  }, [scene]);

  // Clone the scene
  const clonedScene = scene.clone();

  return (
    <group ref={meshRef} position={[position.x, position.y, position.z]} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      <group ref={groupRef}>
        <primitive object={clonedScene} scale={scale} position={[0, 0, 0]} />
      </group>
    </group>
  );
};

// Main HumanModel component - reads from store
export const HumanModel = ({ modelId }) => {
  const getModelById = useLightReferenceStore((state) => state.getModelById);
  const model = getModelById(modelId);

  // If no model found, use primitive fallback
  if (!model) {
    return <PrimitiveModel />;
  }

  // Custom models are loaded from IndexedDB
  if (model.category === 'custom') {
    return <DynamicModel modelId={model.id} />;
  }

  // Built-in models use file path
  if (model.path) {
    return <GLTFModel modelPath={model.path} />;
  }

  // Fallback to primitive
  return <PrimitiveModel />;
};

// Preload a model by path (for built-in models)
export const preloadModel = (modelPath) => {
  if (modelPath) {
    useGLTF.preload(modelPath);
  }
};
