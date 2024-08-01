import { useMemo } from "react";
import { PolyhedronGeometry } from "three";

import Dx from "./Dx";

import { D6_CONST } from "./constants";

const D6 = ({ position, color }) => {
  const geometryArgs = useMemo(() => {
    // const sides = 6;
    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ].flat();

    const faces = [
      // 0
      [2, 1, 0],
      [0, 3, 2],
      // 1
      [0, 4, 7],
      [7, 3, 0],
      // 2
      [0, 1, 5],
      [5, 4, 0],
      // 3
      [1, 2, 6],
      [6, 5, 1],
      // 4
      [2, 3, 7],
      [7, 6, 2],
      // 5
      [4, 5, 6],
      [6, 7, 4],
    ].flat();

    return [vertices, faces];
  }, []);

  const geometry = useMemo(() => {
    const retVal = new PolyhedronGeometry(
      geometryArgs[0],
      geometryArgs[1],
      D6.RADIUS,
      0
    );
    retVal.name = D6_CONST.NAME;
    retVal.groupSize = D6_CONST.GROUP_SIZE;
    return retVal;
  }, [geometryArgs]);

  return (
    <Dx geometry={geometry} position={position} color={color}>
      <polyhedronGeometry args={[...geometryArgs, D6_CONST.RADIUS, 0]} />
    </Dx>
  );
};

export default D6;
