import { useMemo } from "react";
import { OctahedronGeometry } from "three";

import Dx from "./Dx";

import { D8_CONST } from "./constants";

const D8 = ({ position, color }) => {
  const geometry = useMemo(() => {
    const retVal = new OctahedronGeometry(D8_CONST.RADIUS, 0);
    retVal.name = D8_CONST.NAME;
    retVal.groupSize = D8_CONST.GROUP_SIZE;
    return retVal;
  }, []);

  return (
    <Dx geometry={geometry} position={position} color={color}>
      <octahedronGeometry args={[D8_CONST.RADIUS]} />
    </Dx>
  );
};

export default D8;
