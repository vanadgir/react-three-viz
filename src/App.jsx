import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import "./App.css";

const D20 = ({ position, color }) => {
  return (
    <mesh position={position}>
      <icosahedronGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const TablePlane = () => {
  const texture = useLoader(THREE.TextureLoader, "../assets/table.jpg");

  return (
    <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas>
      <directionalLight position={[0, 1, 1]} />

      <Suspense fallback={null}>
        <TablePlane />
      </Suspense>

      <D20 position={[-2, 0, 0]} color={"red"} />
      <D20 position={[2, 0, 0]} color={"green"} />
      
    </Canvas>
  );
};

export default App;
