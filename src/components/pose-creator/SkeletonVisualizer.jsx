import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';

// This component visualizes the skeleton by creating a SkeletonHelper
// that follows the same transforms as the PosableModel
export const SkeletonVisualizer = ({ modelId }) => {
  const groupRef = useRef();
  const helperRef = useRef(null);
  const bonesRef = useRef([]);

  const boneRotations = usePoseCreatorStore((state) => state.boneRotations);
  const model = usePoseCreatorStore((state) => state.model);

  // We need access to the actual bones from the loaded model
  // For now, we'll skip visualization if we don't have bones
  // The PosableModel will share its bones through the store in a future update

  // For simplicity, let's disable the skeleton visualization for now
  // since it requires sharing bone references with PosableModel
  return null;

  // When we want to re-enable this, we need to:
  // 1. Have PosableModel store its bones in a ref that SkeletonVisualizer can access
  // 2. Or use a context to share the bones
  // 3. Apply the same -90° X rotation and scale
};
