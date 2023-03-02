import { Box, Text, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

const Player = ({ socket }) => {
  const [, get] = useKeyboardControls();

  const cubeRef = useRef();

  useFrame(
    (state, delta) => {
      const { forward, backward, left, right, jump, shift } = get();
      const distance = 5 * delta;
      if (forward) cubeRef.current.translateZ(-distance);
      if (backward) cubeRef.current.translateZ(distance);
      if (left) cubeRef.current.translateX(-distance);
      if (right) cubeRef.current.translateX(distance);

      const position = cubeRef.current.position;
      const rotation = cubeRef.current.rotation;
      const { id } = socket;

      const posArray = [];
      const rotArray = [];

      position.toArray(posArray);
      rotation.toArray(rotArray);

      socket.emit("move", {
        id,
        rotation: rotArray,
        position: posArray,
      });

      // console.log("player", posArray);

      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(cubeRef.current.position);
      cameraPosition.z += 5;
      cameraPosition.y += 2;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(cubeRef.current.position);
      cameraTarget.y += 0.55;

      state.camera.position.copy(cameraPosition);
      state.camera.lookAt(cameraTarget);
    },
    [cubeRef, socket]
  );

  return (
    <mesh>
      <Box
        position={[0, 1, 0]}
        ref={cubeRef}

        // visible={false}
      />
      <meshNormalMaterial />
    </mesh>
  );
};

export default Player;
