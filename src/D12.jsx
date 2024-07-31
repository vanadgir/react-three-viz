import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo, useState } from "react";
import { DodecahedronGeometry } from "three";

import Dx from "./Dx";

import CannonUtils from "./CannonUtils";
import { D12_RADIUS } from "./constants"; 

const D12 = ({ position, color }) => {
  const [collidingPlane, setCollidingPlane] = useState(false);
  const [lastContactId, setLastContactId] = useState(null);

  const geometry = useMemo(() => new DodecahedronGeometry(D12_RADIUS, 0), []);
  geometry.name = "d12";
  geometry.groupSize = 3;

  const args = useMemo(
    () => CannonUtils.toConvexPolyhedronProps(geometry),
    [geometry]
  );

  const [ref, api] = useConvexPolyhedron(() => ({
    args,
    mass: 1,
    position,
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
      <dodecahedronGeometry args={[D12_RADIUS]} />
    </Dx>
  );
};

export default D12;
