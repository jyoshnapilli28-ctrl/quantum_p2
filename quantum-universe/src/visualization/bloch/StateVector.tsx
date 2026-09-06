import React from 'react';
import * as THREE from 'three';

interface StateVectorProps {
  x: number;
  y: number;
  z: number;
}

export const StateVector: React.FC<StateVectorProps> = ({ x, y, z }) => {
  // Vector pointing to (x, y, z)
  // Default orientation for Cylinder/Cone is along Y-axis.
  // We need to rotate them to point along the (x, y, z) vector.
  const targetPosition = new THREE.Vector3(x, y, z);
  const quaternion = new THREE.Quaternion();
  
  if (targetPosition.lengthSq() > 0.001) {
    targetPosition.normalize();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetPosition);
  }

  // Length is 1.0 (radius of sphere)
  const shaftLength = 0.85;
  const tipLength = 0.15;
  
  return (
    <group quaternion={quaternion}>
      {/* Shaft */}
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, shaftLength, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Tip */}
      <mesh position={[0, shaftLength + tipLength / 2, 0]}>
        <coneGeometry args={[0.04, tipLength, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Glow Point Light at tip */}
      <pointLight position={[0, 1.0, 0]} color="#FFFFFF" intensity={2} distance={2} decay={2} />
      
      {/* Glow dot */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};
