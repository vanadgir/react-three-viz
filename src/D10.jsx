import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo, useState } from "react";
import { PolyhedronGeometry } from "three";

import Dx from "./Dx";

import CannonUtils from "./CannonUtils";
import { D10_RADIUS } from "./constants";

const D10 = ({ position, color }) => {
  const [collidingPlane, setCollidingPlane] = useState(false);
  const [lastContactId, setLastContactId] = useState(null);

  const geometryArgs = useMemo(() => {
    const sides = 10;
    const vertices = [
      [0, 0, 1],
      [0, 0, -1],
    ].flat();

    for (let i = 0; i < sides; ++i) {
      const b = (i * Math.PI * 2) / sides;
      vertices.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1));
    }

    const faces = [
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 5],
      [0, 5, 6],
      [0, 6, 7],
      [0, 7, 8],
      [0, 8, 9],
      [0, 9, 10],
      [0, 10, 11],
      [0, 11, 2],
      [1, 3, 2],
      [1, 4, 3],
      [1, 5, 4],
      [1, 6, 5],
      [1, 7, 6],
      [1, 8, 7],
      [1, 9, 8],
      [1, 10, 9],
      [1, 11, 10],
      [1, 2, 11],
    ].flat();
    return [vertices, faces];
  }, []);

  const geometry = useMemo(
    () =>
      new PolyhedronGeometry(geometryArgs[0], geometryArgs[1], D10_RADIUS, 0),
    [geometryArgs]
  );

  const args = useMemo(
    () => CannonUtils.toConvexPolyhedronProps(geometry, 3),
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
      <polyhedronGeometry args={[...geometryArgs, D10_RADIUS, 0]} />
    </Dx>
  );
};

export default D10;
