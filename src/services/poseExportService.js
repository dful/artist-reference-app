/**
 * Service for exporting posed models as GLB files.
 * Handles pose baking, GLB export, and integration with Light Reference.
 */

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';
import { saveModelData } from './modelStorageService';
import { useLightReferenceStore } from '../stores/lightReferenceStore';
import { BONE_DEFINITIONS } from '../utils/constants';

/**
 * Create a Three.js scene with a posed model from primitive geometry
 * @param {Object} pose - The pose state with rotation values in degrees
 * @returns {THREE.Scene} Scene with posed primitive model
 */
export function createPosedPrimitiveScene(pose) {
  const scene = new THREE.Scene();

  // Materials
  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xe0c8b0, roughness: 0.8 });
  const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5568, roughness: 0.6 });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.7 });
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.8 });

  // Helper to convert degrees to radians
  const degToRad = (deg) => (deg * Math.PI) / 180;

  // Get rotation array from pose
  const getRotation = (boneName) => {
    const bonePose = pose[boneName];
    if (!bonePose) return [0, 0, 0];
    return [degToRad(bonePose.x), degToRad(bonePose.y), degToRad(bonePose.z)];
  };

  // Create bones
  const hips = new THREE.Bone();
  hips.name = 'Hips';
  hips.rotation.set(...getRotation('hips'));

  const spine = new THREE.Bone();
  spine.name = 'Spine';
  spine.rotation.set(...getRotation('spine'));

  const spine1 = new THREE.Bone();
  spine1.name = 'Spine1';
  spine1.rotation.set(...getRotation('spine1'));

  const spine2 = new THREE.Bone();
  spine2.name = 'Spine2';
  spine2.rotation.set(...getRotation('spine2'));

  const neck = new THREE.Bone();
  neck.name = 'Neck';
  neck.rotation.set(...getRotation('neck'));

  const head = new THREE.Bone();
  head.name = 'Head';
  head.rotation.set(...getRotation('head'));

  const leftShoulder = new THREE.Bone();
  leftShoulder.name = 'LeftShoulder';
  leftShoulder.rotation.set(...getRotation('leftShoulder'));

  const leftArm = new THREE.Bone();
  leftArm.name = 'LeftArm';
  leftArm.rotation.set(...getRotation('leftArm'));

  const leftForeArm = new THREE.Bone();
  leftForeArm.name = 'LeftForeArm';
  leftForeArm.rotation.set(...getRotation('leftForeArm'));

  const leftHand = new THREE.Bone();
  leftHand.name = 'LeftHand';
  leftHand.rotation.set(...getRotation('leftHand'));

  const rightShoulder = new THREE.Bone();
  rightShoulder.name = 'RightShoulder';
  rightShoulder.rotation.set(...getRotation('rightShoulder'));

  const rightArm = new THREE.Bone();
  rightArm.name = 'RightArm';
  rightArm.rotation.set(...getRotation('rightArm'));

  const rightForeArm = new THREE.Bone();
  rightForeArm.name = 'RightForeArm';
  rightForeArm.rotation.set(...getRotation('rightForeArm'));

  const rightHand = new THREE.Bone();
  rightHand.name = 'RightHand';
  rightHand.rotation.set(...getRotation('rightHand'));

  const leftUpLeg = new THREE.Bone();
  leftUpLeg.name = 'LeftUpLeg';
  leftUpLeg.rotation.set(...getRotation('leftUpLeg'));

  const leftLeg = new THREE.Bone();
  leftLeg.name = 'LeftLeg';
  leftLeg.rotation.set(...getRotation('leftLeg'));

  const leftFoot = new THREE.Bone();
  leftFoot.name = 'LeftFoot';
  leftFoot.rotation.set(...getRotation('leftFoot'));

  const rightUpLeg = new THREE.Bone();
  rightUpLeg.name = 'RightUpLeg';
  rightUpLeg.rotation.set(...getRotation('rightUpLeg'));

  const rightLeg = new THREE.Bone();
  rightLeg.name = 'RightLeg';
  rightLeg.rotation.set(...getRotation('rightLeg'));

  const rightFoot = new THREE.Bone();
  rightFoot.name = 'RightFoot';
  rightFoot.rotation.set(...getRotation('rightFoot'));

  // Build skeleton hierarchy
  hips.add(spine);
  spine.add(spine1);
  spine1.add(spine2);
  spine2.add(neck);
  neck.add(head);
  spine2.add(leftShoulder);
  spine2.add(rightShoulder);
  leftShoulder.add(leftArm);
  leftArm.add(leftForeArm);
  leftForeArm.add(leftHand);
  rightShoulder.add(rightArm);
  rightArm.add(rightForeArm);
  rightForeArm.add(rightHand);
  hips.add(leftUpLeg);
  leftUpLeg.add(leftLeg);
  leftLeg.add(leftFoot);
  hips.add(rightUpLeg);
  rightUpLeg.add(rightLeg);
  rightLeg.add(rightFoot);

  // Set bone positions
  hips.position.set(0, 0.95, 0);
  spine.position.set(0, 0.2, 0);
  spine1.position.set(0, 0.2, 0);
  spine2.position.set(0, 0.2, 0);
  neck.position.set(0, 0.2, 0);
  head.position.set(0, 0.16, 0);
  leftShoulder.position.set(-0.22, 0.15, 0);
  rightShoulder.position.set(0.22, 0.15, 0);
  leftArm.position.set(-0.12, 0, 0);
  leftForeArm.position.set(-0.24, 0, 0);
  leftHand.position.set(-0.24, 0, 0);
  rightArm.position.set(0.12, 0, 0);
  rightForeArm.position.set(0.24, 0, 0);
  rightHand.position.set(0.24, 0, 0);
  leftUpLeg.position.set(-0.1, -0.15, 0);
  leftLeg.position.set(0, -0.44, 0);
  leftFoot.position.set(0, -0.44, 0);
  rightUpLeg.position.set(0.1, -0.15, 0);
  rightLeg.position.set(0, -0.44, 0);
  rightFoot.position.set(0, -0.44, 0);

  // Create meshes
  const meshes = [];

  // Hips/Torso
  const hipsGeom = new THREE.BoxGeometry(0.4, 0.3, 0.2);
  const hipsMesh = new THREE.Mesh(hipsGeom, shirtMaterial);
  hipsMesh.position.set(0, 0.95, 0);
  meshes.push(hipsMesh);

  // Spine meshes
  const spineGeom = new THREE.BoxGeometry(0.35, 0.2, 0.18);
  const spineMesh = new THREE.Mesh(spineGeom, shirtMaterial);
  spineMesh.position.set(0, 1.25, 0);
  meshes.push(spineMesh);

  const spine1Geom = new THREE.BoxGeometry(0.38, 0.24, 0.2);
  const spine1Mesh = new THREE.Mesh(spine1Geom, shirtMaterial);
  spine1Mesh.position.set(0, 1.47, 0);
  meshes.push(spine1Mesh);

  const spine2Geom = new THREE.BoxGeometry(0.42, 0.2, 0.2);
  const spine2Mesh = new THREE.Mesh(spine2Geom, shirtMaterial);
  spine2Mesh.position.set(0, 1.64, 0);
  meshes.push(spine2Mesh);

  // Neck
  const neckGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 12);
  const neckMesh = new THREE.Mesh(neckGeom, skinMaterial);
  neckMesh.position.set(0, 1.83, 0);
  meshes.push(neckMesh);

  // Head
  const headGeom = new THREE.SphereGeometry(0.12, 24, 24);
  const headMesh = new THREE.Mesh(headGeom, skinMaterial);
  headMesh.position.set(0, 2.03, 0);
  meshes.push(headMesh);

  // Arms
  const armGeom = new THREE.CapsuleGeometry(0.045, 0.18, 8, 12);
  const forearmGeom = new THREE.CapsuleGeometry(0.04, 0.18, 8, 12);
  const handGeom = new THREE.SphereGeometry(0.04, 12, 12);

  // Left arm group
  const leftArmGroup = new THREE.Group();
  const leftArmMesh = new THREE.Mesh(armGeom, skinMaterial);
  leftArmMesh.rotation.z = Math.PI / 2;
  leftArmMesh.position.set(-0.12, 0, 0);
  leftArmGroup.add(leftArmMesh);

  const leftForeArmMesh = new THREE.Mesh(forearmGeom, skinMaterial);
  leftForeArmMesh.rotation.z = Math.PI / 2;
  leftForeArmMesh.position.set(-0.12, 0, 0);
  const leftForeArmGroup = new THREE.Group();
  leftForeArmGroup.add(leftForeArmMesh);
  leftForeArmGroup.position.set(-0.24, 0, 0);
  leftArmGroup.add(leftForeArmGroup);

  const leftHandMesh = new THREE.Mesh(handGeom, skinMaterial);
  leftHandMesh.position.set(-0.06, 0, 0);
  const leftHandGroup = new THREE.Group();
  leftHandGroup.add(leftHandMesh);
  leftHandGroup.position.set(-0.24, 0, 0);
  leftForeArmGroup.add(leftHandGroup);

  leftArmGroup.position.set(-0.22, 1.79, 0);
  meshes.push(leftArmGroup);

  // Right arm group
  const rightArmGroup = new THREE.Group();
  const rightArmMesh = new THREE.Mesh(armGeom, skinMaterial);
  rightArmMesh.rotation.z = Math.PI / 2;
  rightArmMesh.position.set(0.12, 0, 0);
  rightArmGroup.add(rightArmMesh);

  const rightForeArmMesh = new THREE.Mesh(forearmGeom, skinMaterial);
  rightForeArmMesh.rotation.z = Math.PI / 2;
  rightForeArmMesh.position.set(0.12, 0, 0);
  const rightForeArmGroup = new THREE.Group();
  rightForeArmGroup.add(rightForeArmMesh);
  rightForeArmGroup.position.set(0.24, 0, 0);
  rightArmGroup.add(rightForeArmGroup);

  const rightHandMesh = new THREE.Mesh(handGeom, skinMaterial);
  rightHandMesh.position.set(0.06, 0, 0);
  const rightHandGroup = new THREE.Group();
  rightHandGroup.add(rightHandMesh);
  rightHandGroup.position.set(0.24, 0, 0);
  rightForeArmGroup.add(rightHandGroup);

  rightArmGroup.position.set(0.22, 1.79, 0);
  meshes.push(rightArmGroup);

  // Legs
  const thighGeom = new THREE.CapsuleGeometry(0.06, 0.32, 8, 12);
  const shinGeom = new THREE.CapsuleGeometry(0.05, 0.32, 8, 12);
  const footGeom = new THREE.BoxGeometry(0.08, 0.06, 0.16);

  // Left leg group
  const leftLegGroup = new THREE.Group();
  const leftThighMesh = new THREE.Mesh(thighGeom, pantsMaterial);
  leftThighMesh.position.set(0, -0.22, 0);
  leftLegGroup.add(leftThighMesh);

  const leftShinMesh = new THREE.Mesh(shinGeom, pantsMaterial);
  leftShinMesh.position.set(0, -0.22, 0);
  const leftShinGroup = new THREE.Group();
  leftShinGroup.add(leftShinMesh);
  leftShinGroup.position.set(0, -0.44, 0);
  leftLegGroup.add(leftShinGroup);

  const leftFootMesh = new THREE.Mesh(footGeom, shoeMaterial);
  leftFootMesh.position.set(0, -0.04, 0.06);
  const leftFootGroup = new THREE.Group();
  leftFootGroup.add(leftFootMesh);
  leftFootGroup.position.set(0, -0.44, 0);
  leftShinGroup.add(leftFootGroup);

  leftLegGroup.position.set(-0.1, 0.8, 0);
  meshes.push(leftLegGroup);

  // Right leg group
  const rightLegGroup = new THREE.Group();
  const rightThighMesh = new THREE.Mesh(thighGeom, pantsMaterial);
  rightThighMesh.position.set(0, -0.22, 0);
  rightLegGroup.add(rightThighMesh);

  const rightShinMesh = new THREE.Mesh(shinGeom, pantsMaterial);
  rightShinMesh.position.set(0, -0.22, 0);
  const rightShinGroup = new THREE.Group();
  rightShinGroup.add(rightShinMesh);
  rightShinGroup.position.set(0, -0.44, 0);
  rightLegGroup.add(rightShinGroup);

  const rightFootMesh = new THREE.Mesh(footGeom, shoeMaterial);
  rightFootMesh.position.set(0, -0.04, 0.06);
  const rightFootGroup = new THREE.Group();
  rightFootGroup.add(rightFootMesh);
  rightFootGroup.position.set(0, -0.44, 0);
  rightShinGroup.add(rightFootGroup);

  rightLegGroup.position.set(0.1, 0.8, 0);
  meshes.push(rightLegGroup);

  // Apply rotations to all groups based on pose
  applyPoseToGroup(leftArmGroup, pose, ['leftShoulder', 'leftArm']);
  applyPoseToGroup(leftForeArmGroup, pose, ['leftForeArm']);
  applyPoseToGroup(leftHandGroup, pose, ['leftHand']);
  applyPoseToGroup(rightArmGroup, pose, ['rightShoulder', 'rightArm']);
  applyPoseToGroup(rightForeArmGroup, pose, ['rightForeArm']);
  applyPoseToGroup(rightHandGroup, pose, ['rightHand']);
  applyPoseToGroup(leftLegGroup, pose, ['leftUpLeg']);
  applyPoseToGroup(leftShinGroup, pose, ['leftLeg']);
  applyPoseToGroup(leftFootGroup, pose, ['leftFoot']);
  applyPoseToGroup(rightLegGroup, pose, ['rightUpLeg']);
  applyPoseToGroup(rightShinGroup, pose, ['rightLeg']);
  applyPoseToGroup(rightFootGroup, pose, ['rightFoot']);
  applyPoseToGroup(neckMesh, pose, ['neck']);
  applyPoseToGroup(headMesh, pose, ['head']);

  // Add all meshes to scene
  meshes.forEach((mesh) => scene.add(mesh));

  // Add lights for export preview
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  return scene;
}

/**
 * Apply pose rotations to a Three.js group
 */
function applyPoseToGroup(group, pose, boneNames) {
  boneNames.forEach((boneName) => {
    const bonePose = pose[boneName];
    if (bonePose) {
      const radX = (bonePose.x * Math.PI) / 180;
      const radY = (bonePose.y * Math.PI) / 180;
      const radZ = (bonePose.z * Math.PI) / 180;
      group.rotation.x += radX;
      group.rotation.y += radY;
      group.rotation.z += radZ;
    }
  });
}

/**
 * Export scene as GLB file and trigger download
 * @param {Object} pose - The pose state
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export async function exportAsGLB(pose, filename = 'posed-model.glb') {
  const scene = createPosedPrimitiveScene(pose);

  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        if (result instanceof ArrayBuffer) {
          // Create blob and download
          const blob = new Blob([result], { type: 'model/gltf-binary' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();

          // Cleanup
          URL.revokeObjectURL(url);
          resolve();
        } else {
          reject(new Error('Expected binary output'));
        }
      },
      (error) => {
        console.error('GLB export failed:', error);
        reject(error);
      },
      { binary: true }
    );
  });
}

/**
 * Save posed model to IndexedDB for use in Light Reference
 * @param {Object} pose - The pose state
 * @param {string} modelName - Name for the model
 * @returns {Promise<string>} Model ID
 */
export async function saveToLightReference(pose, modelName) {
  const scene = createPosedPrimitiveScene(pose);

  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      async (result) => {
        if (result instanceof ArrayBuffer) {
          try {
            const modelId = `posed-${Date.now()}`;

            // Save to IndexedDB
            await saveModelData(modelId, result);

            // Add to Light Reference store
            const store = useLightReferenceStore.getState();
            store.addCustomModel({
              id: modelId,
              name: modelName,
              thumbnail: null,
              category: 'custom',
              source: 'pose-creator',
            });

            resolve(modelId);
          } catch (error) {
            console.error('Failed to save posed model:', error);
            reject(error);
          }
        } else {
          reject(new Error('Expected binary output'));
        }
      },
      (error) => {
        console.error('GLB export failed:', error);
        reject(error);
      },
      { binary: true }
    );
  });
}
