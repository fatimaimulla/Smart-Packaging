import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Fefco0201_3D from "../3dModel/Fefco0201";
import Fefco0203_3D from "../3dModel/Fefco0203";
import Fefco0301_3D from "../3dModel/Fefco0301";
import Fefco0401_3D from "../3dModel/Fefco0401";
import Fefco0427_3D from "../3dModel/Fefco0427";

const MODEL_MAP = {
  "0201": Fefco0201_3D,
  "0203": Fefco0203_3D,
  "0301": Fefco0301_3D,
  "0401": Fefco0401_3D,
  "0427": Fefco0427_3D,
};

const Dieline3DViewer = ({
  fefcoCode = "0201",
  slider = 0,
  width = 300,
  length = 400,
  height = 200,
}) => {
  const Model = MODEL_MAP[fefcoCode];

  if (!Model) return null;

  return (
    <Canvas
      shadows
      style={{ height: "100%", width: "100%", background: "white" }}
      camera={{ position: [0, 8, 8], fov: 50 }}
    >
      {/* Lights (copied from friend, unchanged) */}
      <ambientLight intensity={0.25} />

      <hemisphereLight
        skyColor={0xffffff}
        groundColor={0x3a2f28}
        intensity={0.35}
      />

      <directionalLight
        position={[3, 4, 2]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <directionalLight
        position={[-3, 2, 2]}
        intensity={0.35}
        castShadow
      />

      <directionalLight
        position={[0, 3, -3]}
        intensity={0.25}
      />

      {/* 3D Model */}
      <Model
        slider={slider}
        width={width}
        length={length}
        height={height}
      />

      <OrbitControls />
    </Canvas>
  );
};

export default Dieline3DViewer;
