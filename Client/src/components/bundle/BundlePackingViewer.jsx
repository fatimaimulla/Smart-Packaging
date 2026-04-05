import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

import Fefco0201_3D from "@/components/3dModel/Fefco0201";
import Fefco0203_3D from "@/components/3dModel/Fefco0203";
import Fefco0301_3D from "@/components/3dModel/Fefco0301";
import Fefco0401_3D from "@/components/3dModel/Fefco0401";
import Fefco0427_3D from "@/components/3dModel/Fefco0427";

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

const MM_TO_WORLD = 0.01;
const RENDER_BOX_PADDING_MM = 2;

const STEP_COLORS = [
  "#2563eb",
  "#0891b2",
  "#16a34a",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
  "#9333ea",
  "#c026d3",
];

const parseFefcoCode = (value) => {
  const match = String(value || "").match(/(0201|0203|0301|0401|0427)/);
  return match ? match[1] : "0201";
};

const toWorldLength = (value) => Number(value || 0) * MM_TO_WORLD;

const getPlacementColor = (stepIndex, selected) =>
  selected ? "#0f172a" : STEP_COLORS[stepIndex % STEP_COLORS.length];

const Ground = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#dbeafe" roughness={0.96} metalness={0} />
    </mesh>
    <gridHelper args={[50, 50, "#94a3b8", "#cbd5e1"]} position={[0, 0, 0]} />
  </group>
);

const PlacementBox = ({
  placement,
  order,
  dimensions,
  renderDimensions,
  selected,
  showLabel,
}) => {
  const sizeX = toWorldLength(placement?.paddedDimensions?.l);
  const sizeY = toWorldLength(placement?.paddedDimensions?.h);
  const sizeZ = toWorldLength(placement?.paddedDimensions?.w);
  const boxLength = toWorldLength(renderDimensions?.l);
  const boxWidth = toWorldLength(renderDimensions?.w);
  const clearanceX = toWorldLength(
    ((renderDimensions?.l || 0) - (dimensions?.l || 0)) / 2,
  );
  const clearanceY = toWorldLength(
    ((renderDimensions?.h || 0) - (dimensions?.h || 0)) / 2,
  );
  const clearanceZ = toWorldLength(
    ((renderDimensions?.w || 0) - (dimensions?.w || 0)) / 2,
  );

  const x =
    -boxLength / 2 +
    clearanceX +
    toWorldLength(placement?.position?.x) +
    sizeX / 2;
  const y =
    clearanceY +
    toWorldLength(placement?.position?.z) +
    sizeY / 2 +
    0.01;
  const z =
    -boxWidth / 2 +
    clearanceZ +
    toWorldLength(placement?.position?.y) +
    sizeZ / 2;

  const color = getPlacementColor(order - 1, selected);

  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[sizeX, sizeY, sizeZ]} />
        <meshStandardMaterial
          color={color}
          metalness={selected ? 0.12 : 0.04}
          roughness={selected ? 0.35 : 0.48}
          transparent
          opacity={selected ? 0.95 : 0.82}
        />
      </mesh>

      <mesh renderOrder={2}>
        <boxGeometry args={[sizeX * 1.01, sizeY * 1.01, sizeZ * 1.01]} />
        <meshBasicMaterial
          color={selected ? "#38bdf8" : "#ffffff"}
          wireframe
          transparent
          opacity={selected ? 0.9 : 0.35}
        />
      </mesh>

      {showLabel ? (
        <Text
          position={[0, sizeY / 2 + 0.08, 0]}
          fontSize={0.12}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#ffffff"
        >
          {String(order)}
        </Text>
      ) : null}
    </group>
  );
};

const BundleScene = ({
  fefcoCode,
  dimensions,
  foldProgress,
  visiblePlacements,
  selectedPlacementId,
}) => {
  const parsedCode = parseFefcoCode(fefcoCode);
  const Model = MODEL_MAP[parsedCode] || Fefco0201_3D;
  const modelScale = MODEL_NORMALIZE_SCALE[parsedCode] || 1;
  const renderDimensions = useMemo(
    () => ({
      l: Number(dimensions?.l || 0) + RENDER_BOX_PADDING_MM,
      w: Number(dimensions?.w || 0) + RENDER_BOX_PADDING_MM,
      h: Number(dimensions?.h || 0) + RENDER_BOX_PADDING_MM,
    }),
    [dimensions?.h, dimensions?.l, dimensions?.w],
  );
  const showLabels = foldProgress < 0.72;
  const visiblePlacementMeshes = foldProgress >= 0.96 ? [] : visiblePlacements;

  return (
    <>
      <ambientLight intensity={0.62} />
      <hemisphereLight intensity={0.45} groundColor={0xb7c9d8} color={0xffffff} />
      <directionalLight
        castShadow
        intensity={1.05}
        position={[5, 8, 6]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Ground />

      <group>
        <group scale={[modelScale, modelScale, modelScale]}>
          <Model
            slider={foldProgress}
            width={renderDimensions.w || 300}
            length={renderDimensions.l || 300}
            height={renderDimensions.h || 300}
          />
        </group>

        {visiblePlacementMeshes.map((placement, index) => (
          <PlacementBox
            key={placement.itemId}
            placement={placement}
            order={placement.renderOrder || index + 1}
            dimensions={dimensions}
            renderDimensions={renderDimensions}
            selected={placement.itemId === selectedPlacementId}
            showLabel={showLabels}
          />
        ))}
      </group>

      <OrbitControls
        enablePan
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.02}
      />
    </>
  );
};

const BundlePackingViewer = ({
  fefcoCode,
  dimensions,
  placements,
  foldProgress = 0,
  visibleItemIds = [],
  selectedPlacementId = null,
}) => {
  const visiblePlacements = useMemo(() => {
    const visibleSet = new Set(visibleItemIds);
    return (placements || []).filter((placement) => visibleSet.has(placement.itemId));
  }, [placements, visibleItemIds]);

  return (
    <Canvas
      shadows
      camera={{ position: [6.4, 5.6, 7.8], fov: 42 }}
      style={{ width: "100%", height: "100%", background: "#dfeefc" }}
    >
      <BundleScene
        fefcoCode={fefcoCode}
        dimensions={dimensions}
        foldProgress={foldProgress}
        visiblePlacements={visiblePlacements}
        selectedPlacementId={selectedPlacementId}
      />
    </Canvas>
  );
};

export default BundlePackingViewer;
