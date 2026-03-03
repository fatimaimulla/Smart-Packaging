import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Helper to create glue flap geometry (trapezoid with diagonal cuts)
function createGlueFlapGeometry(glueWidth, panelHeight, slope, thickness, S) {
  // Scale dimensions
  const w = glueWidth * S;
  const h = panelHeight * S;
  const s = slope * S;
  const t = thickness * S;

  // Define the 2D shape (in XZ plane, with hinge along Z at X=0)
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); // top-right corner (at hinge)
  shape.lineTo(-w, s); // top-left (diagonal cut)
  shape.lineTo(-w, h - s); // bottom-left (diagonal cut)
  shape.lineTo(0, h); // bottom-right corner
  shape.closePath();

  const extrudeSettings = {
    depth: t,
    bevelEnabled: false,
  };
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Rotate so extrude goes along Y (thickness)
  geom.rotateX(-Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

// Panel component (simple box)
function Panel({
  w,
  h,
  t,
  color,
  position,
  roughness = 0.85,
  metalness = 0.0,
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[w, t, h]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

function Fefco0201_3D({ slider, length, width, height }) {
  const S = 0.01;
  const WIDTH = width * S;
  const LENGTH = length * S;
  const THICKNESS = 0.5 * S;
  const HEIGHT = height * S;
  const FLAP_HEIGHT = length > width ? WIDTH / 2 : LENGTH / 2;
  const FOLD_OFFSET = 5 * S;

  // Glue flap dimensions (as per SVG)
  const glueFlapWidth = width * 0.15 * S;
  const glueFlapSlope = height * 0.1 * S; // slope = 10% of height

  // Refs for hinges
  const leftHinge = useRef(); // for glue flap
  const SecondBaseLeftHinge = useRef();
  const SecondBaseRightHinge = useRef();
  const RightHinge = useRef();
  const baseTopHinge = useRef();
  const baseBottomHinge = useRef();
  const betweenTopHinge = useRef();
  const betweenBottomHinge = useRef();
  const topBaseTopHinge = useRef();
  const topBaseBottomHinge = useRef();
  const lastTopHinge = useRef();
  const lastBottomHinge = useRef();

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const segment = (t, a, b) => {
    if (t <= a) return 0;
    if (t >= b) return 1;
    return easeOutCubic((t - a) / (b - a));
  };

  const foldSide = THREE.MathUtils.degToRad(90 * segment(slider, 0.0, 0.33));
  const foldTop = THREE.MathUtils.degToRad(90 * segment(slider, 0.34, 0.66));
  const foldLast = THREE.MathUtils.degToRad(90 * segment(slider, 0.67, 1));

  // Create glue flap geometry once
  const glueFlapGeo = useMemo(
    () => createGlueFlapGeometry(width * 0.15, height, height * 0.1, 0.5, S),
    [width, height, S],
  );

  useFrame(() => {
    // Side folds (including glue flap on left)
    leftHinge.current.rotation.z = -foldSide; // inward fold
    RightHinge.current.rotation.z = foldSide;
    SecondBaseLeftHinge.current.rotation.z = foldSide;
    SecondBaseRightHinge.current.rotation.z = foldSide;

    const isLengthGreater = length > width;

    const sideFold = isLengthGreater ? foldTop : foldLast;
    const baseBottomFold = isLengthGreater ? foldLast : foldTop;
    const topBaseFold = isLengthGreater ? foldLast : foldTop;

    // Side flaps
    betweenTopHinge.current.rotation.x = sideFold;
    betweenBottomHinge.current.rotation.x = -sideFold;
    lastTopHinge.current.rotation.x = sideFold;
    lastBottomHinge.current.rotation.x = -sideFold;

    // Base flaps
    baseTopHinge.current.rotation.x = foldTop;
    baseBottomHinge.current.rotation.x = -baseBottomFold;

    // Top base flaps
    topBaseTopHinge.current.rotation.x = topBaseFold;
    topBaseBottomHinge.current.rotation.x = -topBaseFold;
  });

  return (
    <group>
      {/* Base panel */}
      <Panel
        w={LENGTH}
        h={HEIGHT}
        t={THICKNESS}
        color="#CBAE91"
        position={[0, 0, 0]}
      />

      {/* Glue flap hinge on left edge of base */}
      <group ref={leftHinge} position={[-LENGTH / 2, 0, 0]}>
        <mesh
          geometry={glueFlapGeo}
          position={[0, 0, HEIGHT / 2]} // center thickness
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#CBAE91"
            roughness={0.85}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Base top flap */}
      <group ref={baseTopHinge} position={[0, 0, -HEIGHT / 2]}>
        <Panel
          w={LENGTH - FOLD_OFFSET}
          h={FLAP_HEIGHT}
          t={THICKNESS}
          color="#CBAE91"
          position={[0, 0, -FLAP_HEIGHT / 2]}
        />
      </group>

      {/* Base bottom flap */}
      <group ref={baseBottomHinge} position={[0, 0, HEIGHT / 2]}>
        <Panel
          w={LENGTH - FOLD_OFFSET}
          h={FLAP_HEIGHT}
          t={THICKNESS}
          color="#CBAE91"
          position={[0, 0, FLAP_HEIGHT / 2]}
        />
      </group>

      {/* Right hinge (between base and between panel) */}
      <group ref={RightHinge} position={[LENGTH / 2, 0, 0]}>
        {/* Between panel */}
        <Panel
          w={WIDTH}
          h={HEIGHT}
          t={THICKNESS}
          color="#CBAE91"
          position={[WIDTH / 2, 0, 0]}
        />

        {/* Between panel top flap */}
        <group ref={betweenTopHinge} position={[0, 0, -HEIGHT / 2]}>
          <Panel
            w={WIDTH - FOLD_OFFSET}
            h={FLAP_HEIGHT}
            t={THICKNESS}
            color="#CBAE91"
            position={[(WIDTH - FOLD_OFFSET) / 2, 0, -FLAP_HEIGHT / 2]}
          />
        </group>

        {/* Between panel bottom flap */}
        <group ref={betweenBottomHinge} position={[0, 0, HEIGHT / 2]}>
          <Panel
            w={WIDTH - FOLD_OFFSET}
            h={FLAP_HEIGHT}
            t={THICKNESS}
            color="#CBAE91"
            position={[(WIDTH - FOLD_OFFSET) / 2, 0, FLAP_HEIGHT / 2]}
          />
        </group>

        {/* Second base left hinge (for top base) */}
        <group ref={SecondBaseLeftHinge} position={[WIDTH, 0, 0]}>
          {/* Top base panel */}
          <Panel
            w={LENGTH}
            h={HEIGHT}
            t={THICKNESS}
            color="#CBAE91"
            position={[LENGTH / 2, 0, 0]}
          />

          {/* Top base top flap */}
          <group ref={topBaseTopHinge} position={[0, 0, -HEIGHT / 2]}>
            <Panel
              w={LENGTH - FOLD_OFFSET}
              h={FLAP_HEIGHT}
              t={THICKNESS}
              color="#CBAE91"
              position={[(LENGTH - FOLD_OFFSET) / 2, 0, -FLAP_HEIGHT / 2]}
            />
          </group>

          {/* Top base bottom flap */}
          <group ref={topBaseBottomHinge} position={[0, 0, HEIGHT / 2]}>
            <Panel
              w={LENGTH - FOLD_OFFSET}
              h={FLAP_HEIGHT}
              t={THICKNESS}
              color="#CBAE91"
              position={[(LENGTH - FOLD_OFFSET) / 2, 0, FLAP_HEIGHT / 2]}
            />
          </group>

          {/* Second base right hinge (for last panel) */}
          <group ref={SecondBaseRightHinge} position={[LENGTH, 0, 0]}>
            {/* Last panel */}
            <Panel
              w={WIDTH}
              h={HEIGHT}
              t={THICKNESS}
              color="#CBAE91"
              position={[WIDTH / 2, 0, 0]}
            />

            {/* Last panel top flap */}
            <group ref={lastTopHinge} position={[0, 0, -HEIGHT / 2]}>
              <Panel
                w={WIDTH - FOLD_OFFSET}
                h={FLAP_HEIGHT}
                t={THICKNESS}
                color="#CBAE91"
                position={[(WIDTH - FOLD_OFFSET) / 2, 0, -FLAP_HEIGHT / 2]}
              />
            </group>

            {/* Last panel bottom flap */}
            <group ref={lastBottomHinge} position={[0, 0, HEIGHT / 2]}>
              <Panel
                w={WIDTH - FOLD_OFFSET}
                h={FLAP_HEIGHT}
                t={THICKNESS}
                color="#CBAE91"
                position={[(WIDTH - FOLD_OFFSET) / 2, 0, FLAP_HEIGHT / 2]}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default Fefco0201_3D;
