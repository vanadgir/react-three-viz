// MIT License
// Copyright (c) 2022, 2023, 2024 Sean Bradley
// Based on https://sbcode.net/threejs/physics-cannonDebugrenderer/#srcclientutilscannonutilsts

import * as THREE from "three";

class CannonUtils {
  // turns mesh information into physics compatible format
  static toConvexPolyhedronProps(geometry) {
    const position = geometry.attributes.position;
    const normal = geometry.attributes.normal;
    const vertices = [];
    for (let i = 0; i < position.count; i++) {
      vertices.push(new THREE.Vector3().fromBufferAttribute(position, i));
    }
    const faces = [];
    for (let i = 0; i < position.count; i += 3) {
      const vertexNormals =
        normal === undefined
          ? []
          : [
              new THREE.Vector3().fromBufferAttribute(normal, i),
              new THREE.Vector3().fromBufferAttribute(normal, i + 1),
              new THREE.Vector3().fromBufferAttribute(normal, i + 2),
            ];
      const face = {
        a: i,
        b: i + 1,
        c: i + 2,
        normals: vertexNormals,
      };
      faces.push(face);
    }

    const verticesMap = {};
    const points = [];
    const changes = [];
    for (let i = 0, il = vertices.length; i < il; i++) {
      const v = vertices[i];
      const key =
        Math.round(v.x * 100) +
        "_" +
        Math.round(v.y * 100) +
        "_" +
        Math.round(v.z * 100);
      if (verticesMap[key] === undefined) {
        verticesMap[key] = i;
        points.push({ x: vertices[i].x, y: vertices[i].y, z: vertices[i].z });
        changes[i] = points.length - 1;
      } else {
        changes[i] = changes[verticesMap[key]];
      }
    }

    const faceIdsToRemove = [];
    for (let i = 0, il = faces.length; i < il; i++) {
      const face = faces[i];
      face.a = changes[face.a];
      face.b = changes[face.b];
      face.c = changes[face.c];
      const indices = [face.a, face.b, face.c];
      for (let n = 0; n < 3; n++) {
        if (indices[n] === indices[(n + 1) % 3]) {
          faceIdsToRemove.push(i);
          break;
        }
      }
    }

    for (let i = faceIdsToRemove.length - 1; i >= 0; i--) {
      const idx = faceIdsToRemove[i];
      faces.splice(idx, 1);
    }

    const cannonFaces = faces.map(function (f) {
      return [f.a, f.b, f.c];
    });

    return [points.map((v) => [v.x, v.y, v.z]), cannonFaces];
  }

  // returns the list of all centroids of the geometry
  // may return more than the conventional number of centroids
  // due to some faces containing multiple triangles
  static getCentroids(geometry) {
    const position = geometry.attributes.position;
    const vertices = [];
    for (let i = 0; i < position.count; i++) {
      vertices.push(new THREE.Vector3().fromBufferAttribute(position, i));
    }

    const centroids = [];
    for (let i = 0; i < position.count; i += 3) {
      const a = vertices[i];
      const b = vertices[i + 1];
      const c = vertices[i + 2];

      const centroid = new THREE.Vector3(
        (a.x + b.x + c.x) / 3,
        (a.y + b.y + c.y) / 3,
        (a.z + b.z + c.z) / 3
      );
      centroids.push(centroid);
    }

    // TODO: handle cases where there are multiple triangles per face

    return centroids;
  }

  // returns the list of all vertices of the geometry
  static getVertices(geometry) {
    const position = geometry.attributes.position;
    const vertices = [];
    for (let i = 0; i < position.count; i++) {
      vertices.push(new THREE.Vector3().fromBufferAttribute(position, i));
    }

    const verticesMap = {};
    const points = [];
    const changes = [];
    for (let i = 0, il = vertices.length; i < il; i++) {
      const v = vertices[i];
      const key =
        Math.round(v.x * 100) +
        "_" +
        Math.round(v.y * 100) +
        "_" +
        Math.round(v.z * 100);
      if (verticesMap[key] === undefined) {
        verticesMap[key] = i;
        points.push({ x: vertices[i].x, y: vertices[i].y, z: vertices[i].z });
        changes[i] = points.length - 1;
      } else {
        changes[i] = changes[verticesMap[key]];
      }
    }

    return points.map((v) => new THREE.Vector3(v.x, v.y, v.z));
  }

  // returns the roll result as well as the source (centroid or vertex)
  static getResult(mat, center, centroids, vertices) {
    const worldCenter = new THREE.Vector3(center.x, center.y, center.z);
    const trueVertical = new THREE.Vector3(0, 1, 0);
    let largestDotProd = -Infinity;
    let result;
    let resultType;

    centroids.map((c, index) => {
      const worldPosition = new THREE.Vector3(c.x, c.y, c.z).applyMatrix4(mat);
      const direction = new THREE.Vector3()
        .subVectors(worldPosition, worldCenter)
        .normalize();
      const dotProd = direction.dot(trueVertical);
      if (dotProd > largestDotProd) {
        largestDotProd = dotProd;
        result = index + 1;
        resultType = "centroid";
      }
    });

    vertices.map((v, index) => {
      const worldPosition = new THREE.Vector3(v.x, v.y, v.z).applyMatrix4(mat);
      const direction = new THREE.Vector3()
        .subVectors(worldPosition, worldCenter)
        .normalize();
      const dotProd = direction.dot(trueVertical);
      if (dotProd > largestDotProd) {
        largestDotProd = dotProd;
        result = index + 1;
        resultType = "vertex";
      }
    });

    return [result, resultType];
  }

  // returns the list of face normals
  static getNormals(geometry) {
    const position = geometry.attributes.position;
    const normals = [];
    for (let i = 0; i < position.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(position, i);
      const b = new THREE.Vector3().fromBufferAttribute(position, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(position, i + 2);
      const normal = new THREE.Vector3()
        .subVectors(b, a)
        .cross(new THREE.Vector3().subVectors(c, a))
        .normalize();
      normals.push(normal);
    }
    return normals;
  }

  // returns a quaternion that can rotate a component to lay flat on its face
  static calculateFaceQuaternion(faceNormal) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), faceNormal);
    return quaternion;
  }
}

export default CannonUtils;
