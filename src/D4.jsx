import { useMemo } from "react";
import { TetrahedronGeometry } from "three";

import Dx from "./Dx";

import { D4_CONST } from "./constants";

const D4 = (props = { position, radius, color, textColor }) => {
  const geometry = useMemo(() => {
    const retVal = new TetrahedronGeometry(props.radius, 0);
    retVal.name = D4_CONST.NAME;
    retVal.groupSize = D4_CONST.GROUP_SIZE;
    return retVal;
  }, []);

  return (
    <Dx {...props} geometry={geometry} inertiaMod={D4_CONST.INERTIA_MOD}>
      <tetrahedronGeometry args={[props.radius, 0]} />
    </Dx>
  );
};

export default D4;
