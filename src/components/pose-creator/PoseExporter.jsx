import { useState } from 'react';
import { Image, Box, Loader2 } from 'lucide-react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { usePoseCreatorStore } from '../../stores/poseCreatorStore';
import { BUILT_IN_POSABLE_MODELS, BONE_CORRECTIONS } from '../../utils/constants';

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

// Create a baked copy of the model with static geometry (no skeleton)
// Returns a new Group containing only static meshes
const createBakedModel = (sourceObject) => {
  // Update the entire scene graph first
  sourceObject.updateMatrixWorld(true);

  // Find all SkinnedMeshes
  const skinnedMeshes = [];
  sourceObject.traverse((child) => {
    if (child.isSkinnedMesh) {
      skinnedMeshes.push(child);
    }
  });

  // Create a new group to hold baked meshes
  const bakedGroup = new THREE.Group();
  bakedGroup.name = 'baked-model';

  skinnedMeshes.forEach((skinnedMesh) => {
    const skeleton = skinnedMesh.skeleton;
    const geometry = skinnedMesh.geometry;

    // Get attributes
    const positionAttr = geometry.getAttribute('position');
    const skinIndexAttr = geometry.getAttribute('skinIndex');
    const skinWeightAttr = geometry.getAttribute('skinWeight');

    if (!skinIndexAttr || !skinWeightAttr) {
      console.warn('SkinnedMesh missing skin data:', skinnedMesh.name);
      return;
    }

    // Update skeleton to compute boneMatrices
    skeleton.update();

    // Clone geometry for baking
    const bakedGeometry = geometry.clone();
    const bakedPositions = bakedGeometry.getAttribute('position');

    // Get skinning data
    const boneMatrices = skeleton.boneMatrices;
    const bindMatrix = skinnedMesh.bindMatrix;
    const bindMatrixInverse = skinnedMesh.bindMatrixInverse;

    // Temporary vectors
    const vertex = new THREE.Vector3();
    const skinned = new THREE.Vector3();
    const temp = new THREE.Vector3();
    const m4 = new THREE.Matrix4();

    for (let i = 0; i < positionAttr.count; i++) {
      vertex.fromBufferAttribute(positionAttr, i);
      vertex.applyMatrix4(bindMatrix);

      skinned.set(0, 0, 0);

      const si = [
        skinIndexAttr.getX(i),
        skinIndexAttr.getY(i),
        skinIndexAttr.getZ(i),
        skinIndexAttr.getW(i),
      ];
      const sw = [
        skinWeightAttr.getX(i),
        skinWeightAttr.getY(i),
        skinWeightAttr.getZ(i),
        skinWeightAttr.getW(i),
      ];

      for (let j = 0; j < 4; j++) {
        const boneIndex = si[j];
        const weight = sw[j];

        if (weight > 0 && boneIndex >= 0) {
          const offset = boneIndex * 16;
          m4.fromArray(boneMatrices, offset);

          temp.copy(vertex);
          temp.applyMatrix4(m4);
          temp.multiplyScalar(weight);

          skinned.add(temp);
        }
      }

      skinned.applyMatrix4(bindMatrixInverse);
      bakedPositions.setXYZ(i, skinned.x, skinned.y, skinned.z);
    }

    bakedPositions.needsUpdate = true;
    bakedGeometry.computeVertexNormals();
    bakedGeometry.computeBoundingSphere();

    // Remove skinning attributes
    bakedGeometry.deleteAttribute('skinIndex');
    bakedGeometry.deleteAttribute('skinWeight');

    // Create static mesh
    const staticMesh = new THREE.Mesh(bakedGeometry, skinnedMesh.material.clone());
    staticMesh.name = skinnedMesh.name || 'baked-mesh';

    // Apply the world transform of the skinned mesh
    staticMesh.applyMatrix4(skinnedMesh.matrixWorld);

    bakedGroup.add(staticMesh);
  });

  return bakedGroup;
};

export const PoseExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const selectedModelId = usePoseCreatorStore((state) => state.selectedModelId);
  const boneRotations = usePoseCreatorStore((state) => state.boneRotations);

  const modelConfig = BUILT_IN_POSABLE_MODELS[selectedModelId];
  const modelPath = modelConfig?.path;

  // Preload the model
  useGLTF.preload(modelPath || '');

  const exportGLB = async () => {
    if (!modelPath) {
      alert('No model selected');
      return;
    }

    setIsExporting(true);
    try {
      // Dynamic imports for exporters/loaders
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

      // Load the model using the same method as the viewer
      const gltf = await new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(modelPath, resolve, undefined, reject);
      });

      const object = gltf.scene;

      // Apply bone rotations (corrections + user pose)
      const bones = collectBones(object);
      bones.forEach((bone) => {
        const poseRotation = boneRotations[bone.name] || { x: 0, y: 0, z: 0 };
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

      // Bake skinning into static geometry
      // Creates a new group with only static meshes (no skeleton/bones)
      const bakedModel = createBakedModel(object);

      // Wrap in a group and apply the same rotation as the viewer (90° around X)
      // This fixes the model orientation for Light Reference compatibility
      // Do NOT apply scale/position here - let Light Reference handle that
      const exportGroup = new THREE.Group();
      exportGroup.rotation.x = Math.PI / 2;
      exportGroup.add(bakedModel);

      // Export (without additional scale/position adjustments)
      const exporter = new GLTFExporter();
      const glb = await new Promise((resolve, reject) => {
        exporter.parse(
          exportGroup,
          (result) => resolve(result),
          (error) => reject(error),
          { binary: true }
        );
      });

      // Download
      const blob = new Blob([glb], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${modelConfig.name || 'posed-model'}-${Date.now()}.glb`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export GLB:', error);
      alert('Failed to export model. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportPNG = async () => {
    setIsExporting(true);
    try {
      // Find the canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        alert('No 3D scene found');
        return;
      }

      // Get the data URL
      const dataUrl = canvas.toDataURL('image/png');

      // Download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pose-${Date.now()}.png`;
      a.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Export
      </h3>

      <div className="space-y-2">
        <button
          onClick={exportGLB}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Box className="w-4 h-4" />
          )}
          Export as GLB
        </button>

        <button
          onClick={exportPNG}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Image className="w-4 h-4" />
          )}
          Export as PNG
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        GLB files can be imported into Light Reference or other 3D software
      </p>
    </div>
  );
};
