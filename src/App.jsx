import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { OrbitControls } from '@react-three/drei'
import { Suspense } from "react";
import { Color } from "three";

import D20 from "./D20";
import TablePlane from "./TablePlane";

import "./App.css";

const App = () => {
  return (
    <Canvas shadows camera={{position: [0, 10, 15]}} dpr={[1, 2]} gl={{ alpha: false }}>
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>

      <Physics>
        <Suspense fallback={null}>
          <TablePlane />
        </Suspense>

        <D20 position={[-2, 3, -5]} color={new Color("red")} />
        <D20 position={[2, 3, -5]} color={new Color("green")} />
      </Physics>

      <OrbitControls />
    </Canvas>
  );
};

export default App;
