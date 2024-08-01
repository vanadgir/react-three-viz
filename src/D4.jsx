import { useMemo } from "react";
import { TetrahedronGeometry } from "three";

import Dx from "./Dx";

import { D4_CONST } from "./constants";

const D4 = ({ position, color }) => {
  const geometry = useMemo(() => {
    const retVal = new TetrahedronGeometry(D4_CONST.RADIUS, 0);
    retVal.name = D4_CONST.NAME;
    retVal.groupSize = D4_CONST.GROUP_SIZE;
    return retVal;
  }, []);

  return (
    <Dx
      geometry={geometry}
      position={position}
      color={color}
      inertiaMod={D4_CONST.INERTIA_MOD}
    >
      <tetrahedronGeometry args={[D4_CONST.RADIUS, 0]} />
    </Dx>
  );
};

export default D4;
