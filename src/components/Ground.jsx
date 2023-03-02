import { DoubleSide } from "three";

const Ground = () => {
  return (
    <>
      <mesh rotation-x={Math.PI * -0.5}>
        <planeGeometry args={[50, 50]} />
        <meshNormalMaterial side={DoubleSide} />
      </mesh>
    </>
  );
};

export default Ground;
