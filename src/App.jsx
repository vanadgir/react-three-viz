import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Color } from "three";

import D4 from "./D4";
import D6 from "./D6";
import D8 from "./D8";
import D10 from "./D10";
import D12 from "./D12";
import D20 from "./D20";
import TablePlane from "./TablePlane";

import "./App.css";

const App = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [12, 12, 12] }}
      dpr={[1, 2]}
      gl={{ alpha: false }}
    >
      <directionalLight
        castShadow
        position={[2.5, 30, 5]}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>
      <Physics>
        <Suspense>
          <TablePlane />
        </Suspense>

        <D20 position={[-2, 3, -5]} color={new Color("purple")} />
        <D12 position={[1, 3, 5]} color={new Color("blue")} />
        <D10 position={[-6, 3, 5]} color={new Color("red")} />
        <D8 position={[3, 3, 5]} color={new Color("orange")} />
        <D6 position={[2, 3, -5]} color={new Color("green")} />
        <D4 position={[-1, 3, 5]} color={new Color("grey")} />
      </Physics>
      <OrbitControls />
    </Canvas>
  );
};

export default App;
