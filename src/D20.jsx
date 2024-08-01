import { useMemo } from "react";
import { IcosahedronGeometry } from "three";

import Dx from "./Dx";

import { D20_CONST } from "./constants";

const D20 = ({ position, color }) => {
  const geometry = useMemo(() => {
    const retVal = new IcosahedronGeometry(D20_CONST.RADIUS, 0);
    retVal.name = D20_CONST.NAME;
    retVal.groupSize = D20_CONST.GROUP_SIZE;
    return retVal;
  }, []);

  return (
    <Dx geometry={geometry} position={position} color={color}>
      <icosahedronGeometry args={[D20_CONST.RADIUS, 0]} />
    </Dx>
  );
};

export default D20;
