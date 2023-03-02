import { Box, Text } from "@react-three/drei";

const UserWrapper = ({ position, rotation, id }) => {
  console.log("userwrapper", position);
  return (
    <mesh>
      <Box position={position} />
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
