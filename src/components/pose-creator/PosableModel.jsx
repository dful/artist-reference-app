import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { BONE_CORRECTIONS } from '../../utils/constants';
import { getModelData, revokeModelUrl } from '../../services/modelStorageService';

// Collect all bones from an object hierarchy
const collectBones = (object) => {
  const bones = [];
  object.traverse((child) => {
    if (child.isBone) {
      bones.push(child);
    }
  });
  return bones;
};

// GLB/GLTF Model component (works with useGLTF from drei)
const GLTFModel = ({ modelPath }) => {
  const groupRef = useRef();
  const bonesRef = useRef([]);
  const modelSetupRef = useRef(false);
  const boneRotationsRef = useRef({});

  const boneRotations = usePoseCreatorStore((state) => state.boneRotations);
  const model = usePoseCreatorStore((state) => state.model);

  // Keep ref in sync with store
  boneRotationsRef.current = boneRotations;

  const { scene } = useGLTF(modelPath);

  // Setup model once when scene loads
  useEffect(() => {
    if (!scene || modelSetupRef.current) return;
    modelSetupRef.current = true;

    // Find all bones
    const bones = collectBones(scene);
    bonesRef.current = bones;

    console.log('Model loaded with', bones.length, 'bones');

    // Check for SkinnedMesh
    scene.traverse((child) => {
      if (child.isSkinnedMesh) {
        console.log('Found SkinnedMesh:', child.name);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

  }, [scene]);

  // Calculate scale to normalize model height
  const normalizedScale = (() => {
    if (!scene) return 1;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return 1.8 / maxDim;
  })();

  // Apply bone rotations every frame (corrections + pose)
  // Uses ref to always get latest boneRotations from store
  useFrame(() => {
    if (!bonesRef.current.length) return;

    const rotations = boneRotationsRef.current;

    bonesRef.current.forEach((bone) => {
      const poseRotation = rotations[bone.name] || { x: 0, y: 0, z: 0 };
      const correction = BONE_CORRECTIONS[bone.name] || { x: 0, y: 0, z: 0 };

      // Combine: correction (internal) + pose (user)
      const finalRotation = {
        x: correction.x + poseRotation.x,
        y: correction.y + poseRotation.y,
        z: correction.z + poseRotation.z,
      };

      bone.rotation.x = THREE.MathUtils.degToRad(finalRotation.x);
      bone.rotation.y = THREE.MathUtils.degToRad(finalRotation.y);
      bone.rotation.z = THREE.MathUtils.degToRad(finalRotation.z);
    });
  });

  if (!scene) {
    return (
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#666" wireframe />
      </mesh>
    );
  }

  return (
    <group
      ref={groupRef}
      rotation={[0, (model.rotation * Math.PI) / 180, 0]}
      scale={model.scale * normalizedScale}
      position={[0, 1, 0]}
    >
      {/* Rotate to fix orientation from FBX/GLB conversion */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
};

// Dynamic model component for custom models (loaded from IndexedDB)
const DynamicModel = ({ modelId }) => {
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(false);
  const modelUrlRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        const data = await getModelData(modelId);
        if (data && isMounted) {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
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

    return () => {
      isMounted = false;
      if (modelUrlRef.current) {
        revokeModelUrl(modelUrlRef.current);
        modelUrlRef.current = null;
      }
    };
  }, [modelId]);

  if (error || !modelUrl) {
    return <FallbackModel />;
  }

  return <GLTFModel modelPath={modelUrl} />;
};

// Fallback primitive model
const FallbackModel = () => {
  const model = usePoseCreatorStore((state) => state.model);

  return (
    <group rotation={[0, (model.rotation * Math.PI) / 180, 0]} position={[0, 1, 0]}>
      <group scale={model.scale}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <capsuleGeometry args={[0.2, 1, 8, 16]} />
          <meshStandardMaterial color="#888" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#888" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

// Main PosableModel component
export const PosableModel = ({ modelId }) => {
  const getPosableModelById = usePoseCreatorStore((state) => state.getPosableModelById);
  const model = getPosableModelById(modelId);

  if (!model) {
    return <FallbackModel />;
  }

  // Custom models are loaded from IndexedDB
  if (model.category === 'custom') {
    return <DynamicModel modelId={model.id} />;
  }

  // Built-in models - use GLTF loader
  if (model.path) {
    return <GLTFModel modelPath={model.path} />;
  }

  return <FallbackModel />;
};
