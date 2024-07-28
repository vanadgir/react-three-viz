import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Color } from "three";

import { ZEROISH } from "./constants";
import CannonUtils from "./CannonUtils";
import {
  randomAngularVelocity,
  randomRotation,
  randomVelocity,
} from "./Vec3Utils";

const Dx = forwardRef(
  (
    {
      children,
      api,
      inertiaMod,
      geometry,
      position,
      color,
      lastContactId,
      collidingPlane,
    },
    ref
  ) => {
    const [hovered, setHover] = useState(false);
    const [lowVelocity, setLowVelocity] = useState(false);
    const [atRest, setAtRest] = useState(false);
    const centroidsRef = useRef([]);
    const interval = useRef(null);

    const resetRoll = useCallback(() => {
      setHover(false);
      setLowVelocity(false);
      api.position.set(...position);
      api.rotation.set(...randomRotation());
      api.velocity.set(...randomVelocity());
      api.angularVelocity.set(...randomAngularVelocity());
    }, [api]);

    const onRest = useCallback(() => {
      setAtRest(true);
            console.log(`You rolled a ${lastContactId + 1}!`);
    }, [lastContactId]);

    useEffect(() => {
      // this effect checks the velocity of the die, and if any velocity values are low enough,
      // it then checks the magnitude of the velocity. if that is low enough, sets lowVelocity to true
      const inertiaFactor = ZEROISH + (inertiaMod ?? 0);
      const unsubscribe = api.velocity.subscribe((velocity) => {
        if (
          Math.abs(velocity[0]) < inertiaFactor ||
          Math.abs(velocity[1]) < inertiaFactor ||
          Math.abs(velocity[2]) < inertiaFactor
        ) {
          const x = Math.pow(Math.abs(velocity[0]), 2);
          const y = Math.pow(Math.abs(velocity[1]), 2);
          const z = Math.pow(Math.abs(velocity[2]), 2);
          const magnitude = Math.sqrt(x + y + z);
          if (magnitude < inertiaFactor) {
            if (!lowVelocity) {
              setLowVelocity(true);
            }
          } else if (lowVelocity) {
            setLowVelocity(false);
          }
        }
      });
      return unsubscribe;
    }, [api, inertiaMod, lowVelocity]);

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

    useEffect(() => {
      // when the die first loads, spin it
      api.angularVelocity.set(...randomAngularVelocity());
    }, []);

    useFrame(() => {
      // this hook gets the current centroids of the geometry's faces
      if (ref) {
        centroidsRef.current = CannonUtils.getCentroids(geometry);
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
          {children}
          <meshStandardMaterial
            color={
              hovered && atRest
                ? "yellow"
                : atRest
                ? color.clone().add(new Color(0.5, 0.5, 0.5))
                : color
            }
          />
          {/* {centroidsRef.current.map((centroid, index) => (
            <Text
              key={index}
              position={centroid}
              fontSize={0.5}
              color="white"
              anchorY="middle"
            >
              {index + 1}
            </Text>
          ))} */}
        </mesh>
      </>
    );
  }
);

export default Dx;
