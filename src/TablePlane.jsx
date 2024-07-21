import { useLoader } from "@react-three/fiber";
import { usePlane } from "@react-three/cannon";
import * as THREE from "three";

const TablePlane = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -3, 0],
    restitution: 0.5,
  }));
  const texture = useLoader(THREE.TextureLoader, "../assets/table.jpg");

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <shadowMaterial color={"#171717"} transparent opacity={0.4} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default TablePlane;
