import { useRef, useEffect, useMemo, forwardRef, useImperativeHandle, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { BONE_DEFINITIONS } from '../../utils/constants';

// Fallback primitive model when rigged model is not available
const PrimitivePoseModel = forwardRef((_, ref) => {
  const groupRef = useRef();
  const pose = usePoseCreatorStore((state) => state.pose);

  useImperativeHandle(ref, () => ({
    getScene: () => groupRef.current,
  }));

  // Convert degrees to radians
  const degToRad = (deg) => (deg * Math.PI) / 180;

  // Apply pose rotations to primitive parts
  const getRotation = (boneName) => {
    const bonePose = pose[boneName];
    if (!bonePose) return [0, 0, 0];
    return [
      degToRad(bonePose.x),
      degToRad(bonePose.y),
      degToRad(bonePose.z),
    ];
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Hips/Torso */}
      <group rotation={getRotation('hips')}>
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color="#4a5568" roughness={0.6} />
        </mesh>

        <group position={[0, 1.15, 0]} rotation={getRotation('spine')}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.35, 0.2, 0.18]} />
            <meshStandardMaterial color="#4a5568" roughness={0.6} />
          </mesh>

          <group position={[0, 0.2, 0]} rotation={getRotation('spine1')}>
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.38, 0.24, 0.2]} />
              <meshStandardMaterial color="#4a5568" roughness={0.6} />
            </mesh>

            <group position={[0, 0.24, 0]} rotation={getRotation('spine2')}>
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[0.42, 0.2, 0.2]} />
                <meshStandardMaterial color="#4a5568" roughness={0.6} />
              </mesh>

              {/* Neck */}
              <group position={[0, 0.2, 0]} rotation={getRotation('neck')}>
                <mesh position={[0, 0.08, 0]}>
                  <cylinderGeometry args={[0.06, 0.08, 0.15, 12]} />
                  <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                </mesh>

                {/* Head */}
                <group position={[0, 0.16, 0]} rotation={getRotation('head')}>
                  <mesh position={[0, 0.12, 0]}>
                    <sphereGeometry args={[0.12, 24, 24]} />
                    <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                  </mesh>
                </group>
              </group>

              {/* Left Shoulder */}
              <group position={[-0.22, 0.15, 0]} rotation={getRotation('leftShoulder')}>
                {/* Left Arm */}
                <group rotation={getRotation('leftArm')}>
                  <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.045, 0.18, 8, 12]} />
                    <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                  </mesh>

                  {/* Left Forearm */}
                  <group position={[-0.24, 0, 0]} rotation={getRotation('leftForeArm')}>
                    <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                      <capsuleGeometry args={[0.04, 0.18, 8, 12]} />
                      <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                    </mesh>

                    {/* Left Hand */}
                    <group position={[-0.24, 0, 0]} rotation={getRotation('leftHand')}>
                      <mesh position={[-0.06, 0, 0]}>
                        <sphereGeometry args={[0.04, 12, 12]} />
                        <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                      </mesh>
                    </group>
                  </group>
                </group>
              </group>

              {/* Right Shoulder */}
              <group position={[0.22, 0.15, 0]} rotation={getRotation('rightShoulder')}>
                {/* Right Arm */}
                <group rotation={getRotation('rightArm')}>
                  <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.045, 0.18, 8, 12]} />
                    <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                  </mesh>

                  {/* Right Forearm */}
                  <group position={[0.24, 0, 0]} rotation={getRotation('rightForeArm')}>
                    <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                      <capsuleGeometry args={[0.04, 0.18, 8, 12]} />
                      <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                    </mesh>

                    {/* Right Hand */}
                    <group position={[0.24, 0, 0]} rotation={getRotation('rightHand')}>
                      <mesh position={[0.06, 0, 0]}>
                        <sphereGeometry args={[0.04, 12, 12]} />
                        <meshStandardMaterial color="#e0c8b0" roughness={0.8} />
                      </mesh>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* Left UpLeg */}
        <group position={[-0.1, 0.8, 0]} rotation={getRotation('leftUpLeg')}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.06, 0.32, 8, 12]} />
            <meshStandardMaterial color="#2d3748" roughness={0.7} />
          </mesh>

          {/* Left Leg */}
          <group position={[0, -0.44, 0]} rotation={getRotation('leftLeg')}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.05, 0.32, 8, 12]} />
              <meshStandardMaterial color="#2d3748" roughness={0.7} />
            </mesh>

            {/* Left Foot */}
            <group position={[0, -0.44, 0]} rotation={getRotation('leftFoot')}>
              <mesh position={[0, -0.04, 0.06]}>
                <boxGeometry args={[0.08, 0.06, 0.16]} />
                <meshStandardMaterial color="#1a202c" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right UpLeg */}
        <group position={[0.1, 0.8, 0]} rotation={getRotation('rightUpLeg')}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.06, 0.32, 8, 12]} />
            <meshStandardMaterial color="#2d3748" roughness={0.7} />
          </mesh>

          {/* Right Leg */}
          <group position={[0, -0.44, 0]} rotation={getRotation('rightLeg')}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.05, 0.32, 8, 12]} />
              <meshStandardMaterial color="#2d3748" roughness={0.7} />
            </mesh>

            {/* Right Foot */}
            <group position={[0, -0.44, 0]} rotation={getRotation('rightFoot')}>
              <mesh position={[0, -0.04, 0.06]}>
                <boxGeometry args={[0.08, 0.06, 0.16]} />
                <meshStandardMaterial color="#1a202c" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

PrimitivePoseModel.displayName = 'PrimitivePoseModel';

// Rigged model component (loads from GLB file)
const RiggedPoseModel = forwardRef(({ modelPath }, ref) => {
  const groupRef = useRef();
  const bonesRef = useRef({});
  const pose = usePoseCreatorStore((state) => state.pose);

  const { scene } = useGLTF(modelPath);

  // Extract bones from the model
  useEffect(() => {
    if (scene) {
      // Traverse and find bones
      scene.traverse((object) => {
        if (object.isBone) {
          // Check against Mixamo naming convention
          Object.entries(BONE_DEFINITIONS).forEach(([boneName, def]) => {
            if (object.name === def.mixamoName) {
              bonesRef.current[boneName] = object;
            }
          });
        }
      });
    }
  }, [scene]);

  // Apply pose rotations to bones
  useEffect(() => {
    Object.entries(bonesRef.current).forEach(([boneName, bone]) => {
      const bonePose = pose[boneName];
      if (bonePose && bone) {
        // Convert degrees to radians and apply rotation
        bone.rotation.x = (bonePose.x * Math.PI) / 180;
        bone.rotation.y = (bonePose.y * Math.PI) / 180;
        bone.rotation.z = (bonePose.z * Math.PI) / 180;
      }
    });
  }, [pose, scene]);

  useImperativeHandle(ref, () => ({
    getScene: () => groupRef.current,
    getBones: () => bonesRef.current,
  }));

  // Clone scene to avoid modifying cached original
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
});

RiggedPoseModel.displayName = 'RiggedPoseModel';

// Main PoseModel component
export const PoseModel = forwardRef(({ modelPath }, ref) => {
  const [useRigged, setUseRigged] = useState(false);

  useEffect(() => {
    // Check if rigged model exists
    if (modelPath) {
      // Try to load rigged model
      fetch(modelPath)
        .then((res) => {
          if (res.ok) {
            setUseRigged(true);
          }
        })
        .catch(() => {
          setUseRigged(false);
        });
    }
  }, [modelPath]);

  if (useRigged && modelPath) {
    return <RiggedPoseModel ref={ref} modelPath={modelPath} />;
  }

  return <PrimitivePoseModel ref={ref} />;
});

PoseModel.displayName = 'PoseModel';
