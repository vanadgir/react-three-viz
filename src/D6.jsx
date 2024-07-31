import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo, useState } from "react";
import { PolyhedronGeometry } from "three";

import Dx from "./Dx";

import CannonUtils from "./CannonUtils";
import { D6_RADIUS } from "./constants";

const D6 = ({ position, color }) => {
  const [collidingPlane, setCollidingPlane] = useState(false);
  const [lastContactId, setLastContactId] = useState(null);

  const geometryArgs = useMemo(() => {
    // const sides = 6;
    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ].flat();

    const faces = [
      // 0
      [2, 1, 0],
      [0, 3, 2],
      // 1
      [0, 4, 7],
      [7, 3, 0],
      // 2
      [0, 1, 5],
      [5, 4, 0],
      // 3
      [1, 2, 6],
      [6, 5, 1],
      // 4
      [2, 3, 7],
      [7, 6, 2],
      // 5
      [4, 5, 6],
      [6, 7, 4],
    ].flat();

    return [vertices, faces];
  }, []);

  const geometry = useMemo(
    () =>
      new PolyhedronGeometry(geometryArgs[0], geometryArgs[1], D6_RADIUS, 0),
    [geometryArgs]
  );
  geometry.name = "d6";
  geometry.groupSize = 2;

  const args = useMemo(
    () => CannonUtils.toConvexPolyhedronProps(geometry, 1),
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
      <polyhedronGeometry args={[...geometryArgs, D6_RADIUS, 0]} />
    </Dx>
  );
};

export default D6;
