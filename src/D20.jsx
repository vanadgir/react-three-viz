import { useMemo } from "react";
import { IcosahedronGeometry } from "three";

import Dx from "./Dx";

import { D20_CONST } from "./constants";

const D20 = (props = { position, radius, color, textColor }) => {
  const geometry = useMemo(() => {
    const retVal = new IcosahedronGeometry(props.radius, 0);
    retVal.name = D20_CONST.NAME;
    retVal.groupSize = D20_CONST.GROUP_SIZE;
    return retVal;
  }, []);

  return (
    <Dx {...props} geometry={geometry}>
      <icosahedronGeometry args={[props.radius, 0]} />
    </Dx>
  );
};

export default D20;
