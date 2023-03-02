import { Box, Text } from "@react-three/drei";
import { useEffect } from "react";

const UserWrapper = ({ position, rotation, id }) => {
  return (
    <mesh position={position}>
      <Box />
      {/* Optionally show the ID above the user's mesh */}
      <Text
        position={[0, 1.0, 0]}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {id}
      </Text>
    </mesh>
  );
};

export default UserWrapper;
