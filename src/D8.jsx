import { useMemo } from "react";
import { OctahedronGeometry } from "three";

import Dx from "./Dx";

import { D8_CONST } from "./constants";

const D8 = (props = { position, radius, color, textColor }) => {
  const geometry = useMemo(() => {
    const retVal = new OctahedronGeometry(props.radius, 0);
    retVal.name = D8_CONST.NAME;
    retVal.groupSize = D8_CONST.GROUP_SIZE;
    return retVal;
  }, []);

  return (
    <Dx geometry={geometry} {...props}>
      <octahedronGeometry args={[props.radius]} />
    </Dx>
  );
};

export default D8;
