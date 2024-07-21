import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Physics, useConvexPolyhedron, usePlane } from "@react-three/cannon";
import { Suspense, useCallback, useMemo, useState } from "react";
import * as THREE from "three";

import CannonUtils from "./CannonUtils";

import "./App.css";

const D20 = ({ position, color }) => {
  const [hovered, setHover] = useState(false);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const args = useMemo(
    () => CannonUtils.toConvexPolyhedronProps(geometry),
    [geometry]
  );
  const [ref, api] = useConvexPolyhedron(() => ({
    args,
    mass: 1,
    position: position,
    restitution: 0.8,
    rotation: resetRotation(),
  }));
  const resetRotation = useCallback(() => {
    return [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    ];
  }, []);
  const resetRoll = useCallback(() => {
    setHover(false);
    api.position.set(...position);
    api.rotation.set(...resetRotation());
  }, [api, resetRotation]);

  useFrame(() => {
    if (api.position.x > 6 || api.position.x < -6) {
      resetRoll();
    }
  });

  return (
    <>
      <mesh
        ref={ref}
        receiveShadow
        castShadow
        onClick={(event) => resetRoll()}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <icosahedronGeometry />
        <meshStandardMaterial color={hovered ? "yellow" : color} />
      </mesh>
    </>
  );
};

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

const App = () => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ alpha: false }}>
      <directionalLight position={[0, 3, 1]} castShadow />

      <Physics>
        <Suspense fallback={null}>
          <TablePlane />
        </Suspense>

        <D20 position={[-2, 3, 0]} color={"red"} />
        <D20 position={[2, 3, 0]} color={"green"} />
      </Physics>
    </Canvas>
  );
};

export default App;
