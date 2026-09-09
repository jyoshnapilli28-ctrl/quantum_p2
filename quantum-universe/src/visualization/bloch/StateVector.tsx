import React from 'react';
import * as THREE from 'three';

interface StateVectorProps {
  x: number;
  y: number;
  z: number;
}

export const StateVector: React.FC<StateVectorProps> = ({ x, y, z }) => {
  const targetPosition = new THREE.Vector3(x, y, z);
  const quaternion = new THREE.Quaternion();
  
  if (targetPosition.lengthSq() > 0.001) {
    targetPosition.normalize();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetPosition);
  }

  const shaftLength = 0.84;
  const tipLength = 0.16;
  
  return (
    <group quaternion={quaternion}>
      {/* State Vector Shaft: QYNX Purple 60 */}
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, shaftLength, 24]} />
        <meshStandardMaterial color="#8A3FFC" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* State Vector Tip: QYNX Purple 50 */}
      <mesh position={[0, shaftLength + tipLength / 2, 0]}>
        <coneGeometry args={[0.045, tipLength, 24]} />
        <meshStandardMaterial color="#A56EFF" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* State Point: Bright White sphere */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.04, 24, 24]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};
