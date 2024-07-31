import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo, useState } from "react";
import { IcosahedronGeometry } from "three";

import Dx from "./Dx";

import CannonUtils from "./CannonUtils";
import { D20_RADIUS } from "./constants";

const D20 = ({ position, color }) => {
  const [collidingPlane, setCollidingPlane] = useState(false);
  const [lastContactId, setLastContactId] = useState(null);

  const geometry = useMemo(() => new IcosahedronGeometry(D20_RADIUS, 0), []);
  geometry.name = "d20";
  geometry.groupSize = 1;

  const args = useMemo(
    () => CannonUtils.toConvexPolyhedronProps(geometry),
    [geometry]
  );
  
  const [ref, api] = useConvexPolyhedron(() => ({
    args,
    mass: 1,
    position: position,
    restitution: 0.8,
    onCollideBegin: (e) => {
      if (e.body.geometry.type === "PlaneGeometry") {
        setCollidingPlane(true);
      }
    },
    onCollide: (e) => {
      if (lastContactId !== e.contact.id) {
        setLastContactId(e.contact.id);
      }
    },
    onCollideEnd: (e) => {
      if (e.body.geometry.type === "PlaneGeometry") {
        setCollidingPlane(false);
      }
    },
  }));

  return (
    <Dx
      api={api}
      ref={ref}
      geometry={geometry}
      position={position}
      color={color}
      lastContactId={lastContactId}
      collidingPlane={collidingPlane}
    >
      <icosahedronGeometry args={[D20_RADIUS, 0]} />
    </Dx>
  );
};

export default D20;
