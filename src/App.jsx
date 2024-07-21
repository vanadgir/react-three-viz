import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Suspense } from "react";
import { Color } from "three";

import D20 from "./D20";
import TablePlane from "./TablePlane";

import "./App.css";

const App = () => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ alpha: false }}>
      <directionalLight position={[0, 3, 1]} castShadow />

      <Physics>
        <Suspense fallback={null}>
          <TablePlane />
        </Suspense>

        <D20 position={[-2, 3, 0]} color={new Color("red")} />
        <D20 position={[2, 3, 0]} color={new Color("green")} />
      </Physics>
    </Canvas>
  );
};

export default App;
