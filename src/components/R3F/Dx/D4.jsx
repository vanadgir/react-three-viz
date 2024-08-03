import { useMemo } from "react";
import { TetrahedronGeometry } from "three";

import Dx from "./Dx";

import { D4_CONST } from "../../../utils";

// check createDx in DiceContext for prop definition
const D4 = (props) => {
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
