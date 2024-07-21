import { Canvas, useLoader } from "@react-three/fiber";
import { Physics, useSphere, usePlane } from "@react-three/cannon";
import { Suspense } from "react";
import * as THREE from "three";
import "./App.css";

const D20 = ({ position, color }) => {
  const [ref] = useSphere(() => ({ 
    mass: 1, 
    position: position,
    restitution: 0.8
  }));

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <icosahedronGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const TablePlane = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -3, 0],
    restitution: 0.5
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

const App = () => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ alpha: false }}>
      <directionalLight position={[0, 3, 1]} castShadow />

      <Physics>
        <Suspense fallback={null}>
          <TablePlane />
        </Suspense>

        <D20 position={[-2, 3, 0]} color={"red"} />
        <D20 position={[2, 6, 0]} color={"green"} />
      </Physics>
    </Canvas>
  );
};

export default App;
