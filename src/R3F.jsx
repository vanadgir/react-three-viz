import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { OrbitControls, Text } from "@react-three/drei";
import { Suspense } from "react";

import { useDice } from "./contexts/DiceContext";

import TablePlane from "./TablePlane";
import font from "../public/TypeMachine.ttf";

const R3F = () => {
  const { diceInPlay } = useDice();
  return (
    <Canvas
      shadows
      camera={{ position: [8, 8, 8] }}
      dpr={[1, 2]}
      gl={{ alpha: false }}
    >
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
      <Physics>
        <Suspense>
          <TablePlane />
        </Suspense>
        {diceInPlay}
      </Physics>
      <OrbitControls />
      {/* HACK(tb): for some stupid reason, Text needs to be prewarmed */}
      <Text font={font} characters="0123456789." />
    </Canvas>
  );
};

export default R3F;
