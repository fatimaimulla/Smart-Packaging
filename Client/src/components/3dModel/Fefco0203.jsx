import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ------------------ helpers ------------------ */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const segment = (t, a, b) => {
  if (t <= a) return 0;
  if (t >= b) return 1;
  return easeOutCubic((t - a) / (b - a));
};

/* ------------------ primitives ------------------ */
function Panel({ w, d, t, mat, pos }) {
  return (
    <mesh position={pos} castShadow receiveShadow material={mat}>
      <boxGeometry args={[w, t, d]} />
      <meshStandardMaterial {...mat} />
      
    </mesh>
  );
}

function Hinge({ refObj, pos, axis, angle = 0, children }) {
  const r = [0, 0, 0];
  if (axis === "x") r[0] = angle;
  if (axis === "y") r[1] = angle;
  if (axis === "z") r[2] = angle;

  return (
    <group ref={refObj} position={pos} rotation={r}>
      {children}
    </group>
  );
}

/* ------------------ FEFCO 0201 ------------------ */
function FEFCO0203({
  length = 300,
  width = 200,
  sideWidth = 150,
  thickness = 1.5,
  slider = 0
}) {
  const S = 0.01;
  const L = length * S;
  const W = width * S;
  const SW = sideWidth * S;
  const T = thickness * S;
  const H = (sideWidth / 2) * S;
  const H2=(length/2)*S// correct FEFCO flap rule

  /* ---------- materials ---------- */
  const texture = useTexture("/cardboard.svg");

   const baseMat = useMemo(() =>({
      map: texture || null,
      color: texture ? 0xffffff : 0xCBAE91,
      roughness: 0.85,
      metalness: 0,
   }), [texture]);
  
   const foldMat = useMemo(() => ({
      map: texture || null,
      color: texture ? 0xffffff : 0xB78B66,
      roughness: 0.86,
      metalness: 0,
    }), [texture]);

  /* ---------- fold phases ---------- */
  const foldSide = THREE.MathUtils.degToRad(90 * segment(slider, 0.0, 0.33));

  const foldTopSide = THREE.MathUtils.degToRad(90 * segment(slider, 0.33, 0.50));
  const foldTopFront=THREE.MathUtils.degToRad(90 * segment(slider, 0.51, 0.66));
  const foldBottomSide = THREE.MathUtils.degToRad(90 * segment(slider, 0.66, 0.82));
  const foldBottomFont=THREE.MathUtils.degToRad(90 * segment(slider, 0.83, 1.0));

  /* ---------- refs ---------- */
  const panel_right = useRef();
  const panel_back = useRef();
  const panel_left = useRef();

  const flap_front_top = useRef();
  const flap_front_bottom = useRef();
  const flap_right_top = useRef();
  const flap_right_bottom = useRef();
  const flap_back_top = useRef();
  const flap_back_bottom = useRef();
  const flap_left_top = useRef();
  const flap_left_bottom = useRef();
  const glue_flap = useRef();


  /* ---------- animate ---------- */
  useFrame(() => {
    panel_right.current.rotation.z = foldSide;
    panel_back.current.rotation.z = foldSide;
    panel_left.current.rotation.z = foldSide;
    glue_flap.current.rotation.z = -foldSide;

    flap_front_top.current.rotation.x = -foldTopFront;
    flap_right_top.current.rotation.x = -foldTopSide;

    flap_back_top.current.rotation.x = -foldTopFront;
    flap_left_top.current.rotation.x = -foldTopSide;

    flap_front_bottom.current.rotation.x = foldBottomFont;
    flap_right_bottom.current.rotation.x = foldBottomSide;
    flap_back_bottom.current.rotation.x = foldBottomFont;
    flap_left_bottom.current.rotation.x = foldBottomSide;

    
  });

  /* ---------- glue flap ---------- */
  const glueWidth =0.25;
  const lean = Math.tan(THREE.MathUtils.degToRad(30)) * glueWidth;

  const glueShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, W);
    s.lineTo(-glueWidth, W - lean);
    s.lineTo(-glueWidth, lean);
    s.closePath();
    return s;
  }, [W, glueWidth, lean]);

  const glueGeom = useMemo(
    () => new THREE.ExtrudeGeometry(glueShape, { depth: T, bevelEnabled: false }),
    [glueShape, T]
  );

  return (
    <group>
      {/* FRONT PANEL (reference) */}
      <Panel w={L} d={W} t={T} mat={baseMat} pos={[0, -T / 2, 0]} />

      {/* FRONT FLAPS */}
      <Hinge refObj={flap_front_top} pos={[0, 0, W / 2]} axis="x">
        <Panel w={L-0.03} d={H} t={T} mat={foldMat} pos={[0, -T / 2, H / 2]} />
      </Hinge>

      <Hinge refObj={flap_front_bottom} pos={[0, 0, -W / 2]} axis="x">
        <Panel w={L-0.03} d={H} t={T} mat={foldMat} pos={[0, -T / 2, -H / 2]} />
      </Hinge>

      {/* GLUE FLAP */}
      <Hinge refObj={glue_flap} pos={[-L / 2, 0, 0]} axis="z">
        <mesh
          geometry={glueGeom}
          material={new THREE.MeshStandardMaterial(baseMat)}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, -W /2]} // 🔥 offset from hinge
          castShadow
          receiveShadow
        />
      </Hinge>


      {/* RIGHT PANEL */}
      <Hinge refObj={panel_right} pos={[L / 2, 0, 0]} axis="z">
        <Panel w={SW} d={W} t={T} mat={baseMat} pos={[SW / 2, -T / 2, 0]} />

        <Hinge refObj={flap_right_top} pos={[0, 0, W / 2]} axis="x">
          <Panel w={SW-0.03} d={H2} t={T} mat={foldMat} pos={[SW / 2, -T / 2, H2 / 2]} />
        </Hinge>

        <Hinge refObj={flap_right_bottom} pos={[0, 0, -W / 2]} axis="x">
          <Panel w={SW-0.03} d={H2} t={T} mat={foldMat} pos={[SW / 2, -T / 2, -H2 / 2]} />
        </Hinge>

        {/* BACK PANEL */}
        <Hinge refObj={panel_back} pos={[SW, 0, 0]} axis="z">
          <Panel w={L} d={W} t={T} mat={baseMat} pos={[L / 2, -T / 2, 0]} />

          <Hinge refObj={flap_back_top} pos={[0, 0, W / 2]} axis="x">
            <Panel w={L-0.03} d={H} t={T} mat={foldMat} pos={[L / 2, -T / 2, H / 2]} />
          </Hinge>

          <Hinge refObj={flap_back_bottom} pos={[0, 0, -W / 2]} axis="x">
            <Panel w={L-0.03} d={H} t={T} mat={foldMat} pos={[L / 2, -T / 2, -H / 2]} />
          </Hinge>

          {/* LEFT PANEL */}
          <Hinge refObj={panel_left} pos={[L, 0, 0]} axis="z">
            <Panel w={SW} d={W} t={T} mat={baseMat} pos={[SW / 2, -T / 2, 0]} />

            <Hinge refObj={flap_left_top} pos={[0, 0, W / 2]} axis="x">
              <Panel w={SW-0.03} d={H2} t={T} mat={foldMat} pos={[SW / 2, -T / 2, H2 / 2]} />
            </Hinge>

            <Hinge refObj={flap_left_bottom} pos={[0, 0, -W / 2]} axis="x">
              <Panel w={SW-0.03} d={H2} t={T} mat={foldMat} pos={[SW / 2, -T / 2, -H2 / 2]} />
            </Hinge>
          </Hinge>
        </Hinge>
      </Hinge>
    </group>
  );
}

/* ------------------ wrapper ------------------ */
export default function Fefco0203_3D() {
  const [slider, setSlider] = useState(0);

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Canvas
        style={{ background: "white" }}
        camera={{ position: [0, 8, 2], fov: 40 }}
      >
        <ambientLight intensity={0.5} />
        <hemisphereLight
        skyColor={0xffffff}
        groundColor={0x44403b}
        intensity={0.3}
        />
        <directionalLight position={[2, 4, 3]} intensity={0.8} />
<directionalLight position={[-2, 1.6, -1]} intensity={0.25} />
        <FEFCO0203 slider={slider} />
        <OrbitControls />
      </Canvas>

      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={slider}
        onChange={(e) => setSlider(+e.target.value)}
        style={{ width: "100%", marginTop: 12 }}
      />
    </div>
  );
}
