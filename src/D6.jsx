import { useBox } from "@react-three/cannon";
import { useMemo, useState } from "react";
import { BoxGeometry } from "three";

import Dx from "./Dx";

import { D6_RADIUS } from "./constants";

const D6 = ({ position, color }) => {
  const [collidingPlane, setCollidingPlane] = useState(false);
  const [lastContactId, setLastContactId] = useState(null);

  const geometry = useMemo(() => new BoxGeometry(D6_RADIUS), []);
  const [ref, api] = useBox(() => ({
    args: [D6_RADIUS, D6_RADIUS, D6_RADIUS],
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
      <boxGeometry args={[D6_RADIUS, D6_RADIUS, D6_RADIUS]} />
    </Dx>
  );
};

export default D6;
