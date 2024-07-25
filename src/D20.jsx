import { useConvexPolyhedron } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IcosahedronGeometry, Matrix4, Color } from "three";

import CannonUtils from "./CannonUtils";

const ZEROISH = 0.07;

const D20 = ({ position, color }) => {
  const [hovered, setHover] = useState(false);
  const [collidingPlane, setCollidingPlane] = useState(false);
  const [lowVelocity, setLowVelocity] = useState(false);
  const [atRest, setAtRest] = useState(false);
  const [lastContactId, setLastContactId] = useState(null);
  const centroidsRef = useRef([]);
  const interval = useRef(null);
  const geometry = useMemo(() => new IcosahedronGeometry(1, 0), []);
  const args = useMemo(
    () => CannonUtils.toConvexPolyhedronProps(geometry),
    [geometry]
  );
  const [ref, api] = useConvexPolyhedron(() => ({
    args,
    mass: 1,
    position: position,
    restitution: 0.8,
    rotation: resetRotation(),
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

  const resetRotation = useCallback(() => {
    return [
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    ];
  }, []);

  const resetVelocity = useCallback(() => {
    return [Math.random() * 3, Math.random() * 3, Math.random() * 3];
  }, []);

  const resetAngularVelocity = useCallback(() => {
    return [
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
    ];
  }, []);

  const resetRoll = useCallback(() => {
    setHover(false);
    setLowVelocity(false);
    api.position.set(...position);
    api.rotation.set(...resetRotation());
    api.velocity.set(...resetVelocity());
    api.angularVelocity.set(...resetAngularVelocity());
  }, [api, resetRotation, resetVelocity, resetAngularVelocity]);

  const onRest = useCallback(() => {
    setAtRest(true);
    console.log(`You rolled a ${lastContactId + 1}!`);
  }, [lastContactId]);

  useEffect(() => {
    // this effect catches dice that go too far to the left or right and resets them
    // because the user won't be able to click them
    const unsubscribe = api.position.subscribe((position) => {
      if (Math.abs(position.x) > 5) {
        resetRoll();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // this effect checks the velocity of the die, and if any velocity values are low enough,
    // it then checks the magnitude of the velocity. if that is low enough, sets lowVelocity to true
    const unsubscribe = api.velocity.subscribe((velocity) => {
      if (
        Math.abs(velocity[0]) < ZEROISH ||
        Math.abs(velocity[1]) < ZEROISH ||
        Math.abs(velocity[2]) < ZEROISH
      ) {
        const x = Math.pow(Math.abs(velocity[0]), 2);
        const y = Math.pow(Math.abs(velocity[1]), 2);
        const z = Math.pow(Math.abs(velocity[2]), 2);
        const magnitude = Math.sqrt(x + y + z);
        if (magnitude < ZEROISH) {
          if (!lowVelocity) {
            setLowVelocity(true);
          }
        } else if (lowVelocity) {
          setLowVelocity(false);
        }
      }
    });
    return unsubscribe;
  }, [lowVelocity]);

  useEffect(() => {
    // this effect checks if the die is low velocity and colliding the plane.
    // if so, then it starts an interval/timer to see if that persists for half a second.
    // if so, sets atRest to true
    if (lowVelocity && collidingPlane && !atRest) {
      interval.current = setInterval(() => {
        onRest();
      }, 500);
    } else if (!lowVelocity || !collidingPlane) {
      if (interval.current) {
        clearInterval(interval.current);
      }
      if (atRest) {
        setAtRest(false);
      }
    }
    return () => clearInterval(interval.current);
  }, [collidingPlane, interval.current, lowVelocity]);

  useFrame(() => {
    if (ref.current) {
      const worldMatrix = ref.current.matrixWorld;
      const updatedCentroids = CannonUtils.getCentroids(geometry).map(
        (centroid) => centroid.applyMatrix4(worldMatrix) 
      );
      centroidsRef.current = updatedCentroids;
    }
  });

  return (
    <>
      <mesh
        ref={ref}
        receiveShadow
        castShadow
        onClick={(event) => {
          if (atRest) {
            resetRoll();
          }
        }}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <icosahedronGeometry />
        <meshStandardMaterial
          color={
            hovered && atRest
              ? "yellow"
              : atRest
              ? color.clone().add(new Color(0.5, 0.5, 0.5))
              : color
          }
        />
        {centroidsRef.current.map((centroid, index) => (
          <Text
            key={index}
            position={centroid}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="center"
          >
            {index + 1}
          </Text>
        ))}
      </mesh>
    </>
  );
};

export default D20;
