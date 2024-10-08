import { Suspense } from "react";
import { Physics } from "@react-three/cannon";
import { OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { useDice } from "../../contexts";
import TablePlane from "./TablePlane";

import font from "../../../assets/fonts/TypeMachine.ttf";
import styles from "./R3F.module.scss";

const R3F = () => {
  const { diceInPlay } = useDice();
  return (
    <div className={styles.R3F}>
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
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, 10, -10]}
          />
        </directionalLight>
        <Physics>
          <Suspense>
            <TablePlane />
          </Suspense>
          {Object.keys(diceInPlay).map((d) => diceInPlay[d]?.component)}
        </Physics>
        <OrbitControls />
        {/* HACK(tb): for some stupid reason, Text needs to be prewarmed */}
        <Text font={font} characters="0123456789." />
      </Canvas>
    </div>
  );
};

export default R3F;
