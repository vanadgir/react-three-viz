import { useMemo } from "react";
import { DodecahedronGeometry } from "three";

import Dx from "./Dx";

import { D12_CONST } from "./constants";

const D12 = ({ position, color }) => {
  const geometry = useMemo(() => {
    const retVal = new DodecahedronGeometry(D12_CONST.RADIUS, 0);
    retVal.name = D12_CONST.NAME;
    retVal.groupSize = D12_CONST.GROUP_SIZE;
    return retVal;
  }, []);

  return (
    <Dx geometry={geometry} position={position} color={color}>
      <dodecahedronGeometry args={[D12_CONST.RADIUS]} />
    </Dx>
  );
};

export default D12;
