import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo, useState } from "react";
import { TetrahedronGeometry } from "three";

import Dx from "./Dx";

import CannonUtils from "./CannonUtils";
import { D4_RADIUS } from "./constants";

const D4 = ({ position, color }) => {
  const [collidingPlane, setCollidingPlane] = useState(false);
  const [lastContactId, setLastContactId] = useState(null);

  const geometry = useMemo(() => new TetrahedronGeometry(D4_RADIUS, 0), []);
  geometry.name = "d4";

  const args = useMemo(
    () => CannonUtils.toConvexPolyhedronProps(geometry),
    [geometry]
  );
  
  const [ref, api] = useConvexPolyhedron(() => ({
    args,
    mass: 1,
    position,
    restitution: 0.9,
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
      inertiaMod={0.02}
    >
      <tetrahedronGeometry args={[D4_RADIUS, 0]} />
    </Dx>
  );
};

export default D4;
