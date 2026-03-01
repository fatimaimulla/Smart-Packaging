import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Fefco0201_3D from "@/components/3dModel/Fefco0201";
import Fefco0203_3D from "@/components/3dModel/Fefco0203";
import Fefco0301_3D from "@/components/3dModel/Fefco0301";
import Fefco0401_3D from "@/components/3dModel/Fefco0401";
import Fefco0427_3D from "@/components/3dModel/Fefco0427";
import { getDropSimulationDynamics } from "@/utils/dropSimulation";

const MODEL_MAP = {
  "0201": Fefco0201_3D,
  "0203": Fefco0203_3D,
  "0301": Fefco0301_3D,
  "0401": Fefco0401_3D,
  "0427": Fefco0427_3D,
};

const MODEL_NORMALIZE_SCALE = {
  "0201": 1,
  "0203": 1,
  "0301": 0.1,
  "0401": 0.1,
  "0427": 1,
};

const ORIENTATION_PROFILE = {
  flat: {
    dropRotation: [0, 0, 0],
    settleRotation: [0, 0, 0],
    topple: false,
    toppleDuration: 0.6,
  },
  side: {
    // Side drop starts on a tilted edge, then topples to the base face.
    dropRotation: [0, 0, Math.PI * 0.37],
    settleRotation: [0, 0, 0],
    topple: true,
    toppleDuration: 0.78,
  },
  edge: {
    // Edge drop starts with a corner-biased pose, then topples flat.
    dropRotation: [Math.PI * 0.24, 0, Math.PI * 0.27],
    settleRotation: [0, 0, 0],
    topple: true,
    toppleDuration: 0.92,
  },
};

const WORLD_METER_SCALE = 2.4;
const GROUND_CLEARANCE = 0.02;
const TOPPLE_SPEED_FACTOR = 0.7; // 30% faster than baseline

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const _tempEuler = new THREE.Euler();
const _xAxis = new THREE.Vector3();
const _yAxis = new THREE.Vector3();
const _zAxis = new THREE.Vector3();

const getHalfHeightForRotation = ({ x, y, z }, rotation) => {
  const halfX = x / 2;
  const halfY = y / 2;
  const halfZ = z / 2;

  _tempEuler.set(rotation[0], rotation[1], rotation[2], "XYZ");
  _xAxis.set(1, 0, 0).applyEuler(_tempEuler);
  _yAxis.set(0, 1, 0).applyEuler(_tempEuler);
  _zAxis.set(0, 0, 1).applyEuler(_tempEuler);

  return (
    Math.abs(_xAxis.y) * halfX +
    Math.abs(_yAxis.y) * halfY +
    Math.abs(_zAxis.y) * halfZ
  );
};

const PaddingVisual = ({ padding, productSize }) => {
  if (padding === "none") return null;

  const [x, y, z] = productSize;
  const shellSize = [x * 1.35, y * 1.35, z * 1.35];

  if (padding === "bubble") {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={shellSize} />
        <meshStandardMaterial
          color="#8ecae6"
          transparent
          opacity={0.14}
          roughness={0.45}
          metalness={0}
          wireframe
        />
      </mesh>
    );
  }

  if (padding === "foam") {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={shellSize} />
        <meshStandardMaterial
          color="#d8f3dc"
          transparent
          opacity={0.28}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    );
  }

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={shellSize} />
      <meshStandardMaterial
        color="#f4d58d"
        transparent
        opacity={0.18}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
};

const SimulationAssembly = ({
  fefcoCode,
  dimensions,
  weightGrams,
  dropHeightCm,
  orientation,
  padding,
  playSignal,
}) => {
  const assemblyRef = useRef();
  const stateRef = useRef({
    running: false,
    pendingStart: false,
    phase: "idle",
    g: 9.81 * WORLD_METER_SCALE,
    startY: 1,
    impactY: 0.4,
    phaseStart: 0,
    bounceVelocity: 0,
    restitution: 0.16,
    compression: 0.08,
    wobble: 0.14,
    dropRotation: [0, 0, 0],
    settleRotation: [0, 0, 0],
    shouldTopple: false,
    toppleDuration: 0.8,
    toppleFrom: [0, 0, 0],
    groundClearance: GROUND_CLEARANCE,
  });

  const Model = MODEL_MAP[fefcoCode] || Fefco0201_3D;
  const modelScale = MODEL_NORMALIZE_SCALE[fefcoCode] || 1;
  const orientationProfile =
    ORIENTATION_PROFILE[orientation] || ORIENTATION_PROFILE.flat;
  const dropRotation = orientationProfile.dropRotation;
  const settleRotation = orientationProfile.settleRotation;
  const unitScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const dynamics = useMemo(
    () => getDropSimulationDynamics({ padding, orientation }),
    [padding, orientation],
  );

  const worldDimensions = useMemo(() => {
    const l = clamp((dimensions?.l ?? 191) * 0.01, 0.6, 7);
    const w = clamp((dimensions?.w ?? 383) * 0.01, 0.6, 7);
    const h = clamp((dimensions?.h ?? 245) * 0.01, 0.4, 6);

    return { x: w, y: h, z: l };
  }, [dimensions?.l, dimensions?.w, dimensions?.h]);

  const productSize = useMemo(() => {
    const massScale = clamp(Math.pow(weightGrams / 1000, 1 / 3), 0.5, 1.4);
    return [
      clamp(worldDimensions.x * 0.32 * massScale, 0.2, worldDimensions.x * 0.7),
      clamp(worldDimensions.y * 0.32 * massScale, 0.2, worldDimensions.y * 0.7),
      clamp(worldDimensions.z * 0.32 * massScale, 0.2, worldDimensions.z * 0.7),
    ];
  }, [weightGrams, worldDimensions.x, worldDimensions.y, worldDimensions.z]);

  const impactHalfHeight = getHalfHeightForRotation(worldDimensions, dropRotation);
  const dynamicClearance =
    orientation === "flat"
      ? GROUND_CLEARANCE
      : GROUND_CLEARANCE + Math.max(0.02, worldDimensions.y * 0.03);
  const impactY = impactHalfHeight + dynamicClearance;
  const dropWorld = clamp((dropHeightCm / 100) * WORLD_METER_SCALE, 0.3, 12);
  const startY = impactY + dropWorld;

  useEffect(() => {
    const assembly = assemblyRef.current;
    if (!assembly) return;

    assembly.position.set(0, startY, 0);
    assembly.rotation.set(dropRotation[0], dropRotation[1], dropRotation[2]);
    assembly.scale.set(1, 1, 1);

    stateRef.current = {
      ...stateRef.current,
      running: false,
      pendingStart: false,
      phase: "idle",
      startY,
      impactY,
      restitution: dynamics.restitution,
      compression: dynamics.compression,
      wobble: dynamics.wobble,
      dropRotation: [...dropRotation],
      settleRotation: [...settleRotation],
      shouldTopple: orientationProfile.topple,
      toppleDuration: Math.max(
        0.22,
        orientationProfile.toppleDuration * TOPPLE_SPEED_FACTOR,
      ),
      toppleFrom: [...dropRotation],
      groundClearance: dynamicClearance,
    };
  }, [startY, impactY, dropRotation, settleRotation, dynamics, orientationProfile, dynamicClearance]);

  useEffect(() => {
    if (!playSignal) return;

    stateRef.current = {
      ...stateRef.current,
      running: true,
      pendingStart: true,
      phase: "fall",
      startY,
      impactY,
      restitution: dynamics.restitution,
      compression: dynamics.compression,
      wobble: dynamics.wobble,
      dropRotation: [...dropRotation],
      settleRotation: [...settleRotation],
      shouldTopple: orientationProfile.topple,
      toppleDuration: Math.max(
        0.22,
        orientationProfile.toppleDuration * TOPPLE_SPEED_FACTOR,
      ),
      toppleFrom: [...dropRotation],
      groundClearance: dynamicClearance,
    };
  }, [playSignal, startY, impactY, dropRotation, settleRotation, dynamics, orientationProfile, dynamicClearance]);

  useFrame(({ clock }) => {
    const assembly = assemblyRef.current;
    if (!assembly) return;

    const s = stateRef.current;
    if (!s.running && !s.pendingStart) return;

    if (s.pendingStart) {
      s.pendingStart = false;
      s.phaseStart = clock.elapsedTime;
      assembly.position.y = s.startY;
      assembly.rotation.set(s.dropRotation[0], s.dropRotation[1], s.dropRotation[2]);
      assembly.scale.set(1, 1, 1);
      return;
    }

    if (s.phase === "fall") {
      const t = clock.elapsedTime - s.phaseStart;
      const nextY = s.startY - 0.5 * s.g * t * t;

      assembly.rotation.set(s.dropRotation[0], s.dropRotation[1], s.dropRotation[2]);

      if (nextY <= s.impactY) {
        assembly.position.y = s.impactY;

        if (s.shouldTopple) {
          s.phase = "topple";
          s.phaseStart = clock.elapsedTime;
          s.toppleFrom = [...s.dropRotation];
        } else {
          s.phase = "bounce";
          s.phaseStart = clock.elapsedTime;
          s.bounceVelocity =
            Math.sqrt(2 * s.g * (s.startY - s.impactY)) * s.restitution;
        }
      } else {
        assembly.position.y = nextY;
      }

      const floorY =
        getHalfHeightForRotation(worldDimensions, s.dropRotation) + s.groundClearance;
      if (assembly.position.y < floorY) {
        assembly.position.y = floorY;
      }
      assembly.scale.lerp(unitScale, 0.2);
      return;
    }

    if (s.phase === "bounce") {
      const t = clock.elapsedTime - s.phaseStart;
      const nextY = s.impactY + s.bounceVelocity * t - 0.5 * s.g * t * t;
      const compression = Math.max(0, Math.sin(Math.min(Math.PI, t * 18))) * s.compression;
      const floorY =
        getHalfHeightForRotation(worldDimensions, s.dropRotation) + s.groundClearance;

      assembly.scale.set(1 + compression * 0.14, 1 - compression, 1 + compression * 0.14);
      assembly.rotation.set(s.dropRotation[0], s.dropRotation[1], s.dropRotation[2]);

      if (nextY <= floorY) {
        s.phase = "settle";
        s.phaseStart = clock.elapsedTime;
        assembly.position.y = floorY;
      } else {
        assembly.position.y = nextY;
      }
      return;
    }

    if (s.phase === "topple") {
      const t = clamp(
        (clock.elapsedTime - s.phaseStart) / s.toppleDuration,
        0,
        1,
      );
      const eased = easeOutCubic(t);

      const rx = THREE.MathUtils.lerp(s.toppleFrom[0], s.settleRotation[0], eased);
      const ry = THREE.MathUtils.lerp(s.toppleFrom[1], s.settleRotation[1], eased);
      const rz = THREE.MathUtils.lerp(s.toppleFrom[2], s.settleRotation[2], eased);

      const currentRotation = [rx, ry, rz];
      const floorY =
        getHalfHeightForRotation(worldDimensions, currentRotation) + s.groundClearance;
      const hop = Math.sin(Math.PI * t) * s.compression * 0.05;

      assembly.rotation.set(rx, ry, rz);
      assembly.position.y = floorY + hop;
      assembly.scale.lerp(unitScale, 0.16);

      if (t >= 1) {
        s.phase = "settle-flat";
        s.phaseStart = clock.elapsedTime;
      }
      return;
    }

    if (s.phase === "settle" || s.phase === "settle-flat") {
      const t = clock.elapsedTime - s.phaseStart;
      const wobble = Math.sin(14 * t) * Math.exp(-3.4 * t) * s.wobble;
      const wobbleX = s.shouldTopple ? wobble * 0.045 : wobble * 0.18;
      const wobbleZ = s.shouldTopple ? wobble * 0.065 : wobble * 0.16;
      const rx = s.settleRotation[0] + wobbleX;
      const ry = s.settleRotation[1];
      const rz = s.settleRotation[2] - wobbleZ;
      const currentRotation = [rx, ry, rz];
      const floorY =
        getHalfHeightForRotation(worldDimensions, currentRotation) + s.groundClearance;

      assembly.position.y = floorY;
      assembly.rotation.set(rx, ry, rz);
      assembly.scale.lerp(unitScale, 0.15);

      if (t > (s.shouldTopple ? 1.1 : 1.4)) {
        s.phase = "done";
        s.running = false;
        assembly.rotation.set(
          s.settleRotation[0],
          s.settleRotation[1],
          s.settleRotation[2],
        );
        assembly.position.y =
          getHalfHeightForRotation(worldDimensions, s.settleRotation) +
          s.groundClearance;
        assembly.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group ref={assemblyRef}>
      <group scale={[modelScale, modelScale, modelScale]}>
        <Model
          slider={1}
          width={dimensions?.w ?? 383}
          length={dimensions?.l ?? 191}
          height={dimensions?.h ?? 245}
        />
      </group>

      <group position={[0, worldDimensions.y * 0.22, 0]}>
        <mesh>
          <boxGeometry args={productSize} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} metalness={0.05} />
        </mesh>
        <PaddingVisual padding={padding} productSize={productSize} />
      </group>
    </group>
  );
};

const Ground = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#dbeafe" roughness={0.92} metalness={0} />
    </mesh>
    <gridHelper args={[40, 40, "#94a3b8", "#cbd5e1"]} position={[0, 0.01, 0]} />
  </group>
);

const DropSimulationViewer = (props) => {
  return (
    <Canvas
      shadows
      camera={{ position: [6.2, 5.4, 7.8], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "#e2e8f0" }}
    >
      <ambientLight intensity={0.42} />
      <hemisphereLight intensity={0.35} groundColor={0xb7c9d8} color={0xffffff} />
      <directionalLight
        castShadow
        intensity={1}
        position={[4, 7, 4]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Ground />
      <SimulationAssembly {...props} />

      <OrbitControls
        enablePan
        minDistance={4}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.08}
      />
    </Canvas>
  );
};

export default DropSimulationViewer;
