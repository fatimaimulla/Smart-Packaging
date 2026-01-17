import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";





/* ------------------ Simple Panel ------------------ */
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
    <mesh
      position={position}
      castShadow
      receiveShadow
    >
      {/* Geometry defines size */}
      <boxGeometry args={[w, t, h]} />

      {/* Material defines look */}
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}


function QuarterCircleFlap({
  height,     // Radius = Height - Flap_offset (you pass this)
  thickness,  // Extrusion thickness
  color = "#CBAE91",
  r
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    // Start at center
    shape.moveTo(0, 0);

    // Straight edge along X
    shape.lineTo(height, 0);

    // Circular arc: center (0,0), radius = height
    // From angle 0 → 90 degrees (counter-clockwise)
    shape.absarc(0, 0, height, 0, Math.PI / 2, false);

    // Straight edge back to center along Y
    shape.lineTo(0, 0);

    return new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: false,
    });
  }, [height, thickness]);

  return (
    <mesh
      geometry={geometry}
      rotation={[r*Math.PI / 2, 0, 0]} // lay flat like your panels
      position={[0,r*thickness/2,0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        metalness={0}
      />
    </mesh>
  );
}


function BasePanelWithHoles({
  width,        // mm
  length,      // mm
  thickness ,   // mm
  holeHeight ,    // mm
  color = "#CBAE91",
  holeWidth,
}) {
  const S = 0.1; // mm → world units

  const W = width ;
  const L = length ;
  const T = thickness ;

  const holeW = holeWidth;
  const holeH = holeHeight ;
  const PI = Math.PI;
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    /* ---------------- BASE RECTANGLE ---------------- */
    shape.moveTo(-W / 2, -L / 2);
    shape.lineTo( W / 2, -L / 2);
    shape.lineTo( W / 2,  L / 2);
    shape.lineTo(-W / 2,  L / 2);
    shape.closePath();

    /* ---------------- HOLE HELPER ---------------- */
    const addHole = (cx, cz) => {
      const hole = new THREE.Path();
      hole.moveTo(cx - holeW / 2, cz - holeH / 2);
      hole.lineTo(cx + holeW / 2, cz - holeH / 2);
      hole.lineTo(cx + holeW / 2, cz + holeH / 2);
      hole.lineTo(cx - holeW / 2, cz + holeH / 2);
      hole.closePath();
      shape.holes.push(hole);
    };

    /* ---------------- HOLE POSITIONS ---------------- */
    const holeX1 = -W / 2 + holeW * 1.5;
    const holeX2 =  W / 2 - holeW * 1.5;

    const holeZTop = -L / 2 + holeH / 2;
    const holeZBottom =  L / 2 - holeH / 2;

    // Top holes
    addHole(holeX1, holeZTop);
    addHole(holeX2, holeZTop);

    // Bottom holes
    addHole(holeX1, holeZBottom);
    addHole(holeX2, holeZBottom);

    /* ---------------- EXTRUDE ---------------- */
    return new THREE.ExtrudeGeometry(shape, {
      depth: T,
      bevelEnabled: false,
    });
  }, [W, L, T, holeW, holeH]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]} // lay flat (Z → Y)
      position={[0, -T / 2, 0]}       // sit on ground
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        metalness={0}
      />
    </mesh>
  );
}


function SlantedFlap({
  width,        // W
  height,       // H
  thickness,    // T
  angleDeg = 70,
  color = "#CBAE91",
  r
}) {
  const geometry = useMemo(() => {
    const theta = THREE.MathUtils.degToRad(angleDeg);
    const dx = height / Math.tan(theta);

    const shape = new THREE.Shape();

    // Bottom-left
    shape.moveTo(0, 0);

    // Bottom-right
    shape.lineTo(width, 0);

    // Top-right
    shape.lineTo(width - dx, height);

    // Top-left
    shape.lineTo(dx, height);

    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: false,
    });
  }, [width, height, thickness, angleDeg]);

  return (
    <mesh
      geometry={geometry}
      position={[0,r*(thickness/2),0]}
      rotation={[Math.PI*r / 2, 0, 0]}   // same orientation as panels
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        
        color={color}
        roughness={0.85}
        metalness={0}
      />
    </mesh>
  );
}







/* ------------------ Scene ------------------ */
function  Fefco0427_3D({ slider , length ,width, height }) {
  const S = 0.01;

  const WIDTH = width * S;
  const LENGTH = length * S;
  const THICKNESS = 0.5 * S;
  const HOLE_WIDTH = WIDTH / 5;
  const FOLD_OFFSET = 2 * S;
  const HEIGHT = height * S;
  const FLAP_HEIGHT = HOLE_WIDTH * 2;
  const BETWEEN_FLAP = THICKNESS * 3.3;
  const HOLE_HEIGHT=THICKNESS*4
  const foldAngle = slider * Math.PI / 2; // 0 → 90°
  
  
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const segment = (t, a, b) => {
  if (t <= a) return 0;
  if (t >= b) return 1;
  return easeOutCubic((t - a) / (b - a));
};

  const foldSide = THREE.MathUtils.degToRad(90 * segment(slider, 0.0, 0.15));
  const foldFlaps = THREE.MathUtils.degToRad(90 * segment(slider, 0.15, 0.30));
  const SideFlaps = THREE.MathUtils.degToRad(90 * segment(slider, 0.30, 0.45));
  const BetweeFlap = THREE.MathUtils.degToRad(90 * segment(slider, 0.45, 0.55));
  const LastFlap = THREE.MathUtils.degToRad(90 * segment(slider, 0.55, 0.65));  
  const Base2SideFlap = THREE.MathUtils.degToRad(90 * segment(slider, 0.65, 0.75)); 
  const Base2CloseHinge = THREE.MathUtils.degToRad(90 * segment(slider, 0.75, 0.85)); 
  
  const Last=THREE.MathUtils.degToRad(90 * segment(slider, 0.85, 1)); 
  
  console.log(foldSide);

  const rightHingeRef = useRef();
  const leftHingeRef = useRef();
    
  const base2LeftHinge = useRef();
  const base2RightHinge = useRef();
  
    const LeftFlapTop = useRef();
    const LeftFlapBottom = useRef();

    const RightFlapTop = useRef();
    const RightFlapBottom = useRef();
    
  const BasetopHinge = useRef();
  const BaseBottomHinge = useRef();

  const BetweenTop = useRef();
  const BetweenBottom = useRef();

  const TopLastFlap = useRef();
  const BottomLastFlap = useRef();
  
  const SlantedFlapTop = useRef();
  const SlantedFlapBottom = useRef();

  const SmallCurveFlapTop = useRef();
  const SmallCurveFlapBottom= useRef();
    
    
  // Animate fold
  useFrame(() => {
    
    rightHingeRef.current.rotation.z = foldSide;
    leftHingeRef.current.rotation.z = -foldSide;


    LeftFlapBottom.current.rotation.x = -foldFlaps;
    LeftFlapTop.current.rotation.x = foldFlaps;
      
    RightFlapBottom.current.rotation.x = -foldFlaps;
    RightFlapTop.current.rotation.x = foldFlaps;
    
    BasetopHinge.current.rotation.x = SideFlaps;
    BaseBottomHinge.current.rotation.x = -SideFlaps;

    BetweenTop.current.rotation.x = BetweeFlap;
    BetweenBottom.current.rotation.x = -BetweeFlap;

    TopLastFlap.current.rotation.x = LastFlap;
    BottomLastFlap.current.rotation.x = -LastFlap;

    SlantedFlapTop.current.rotation.x = Base2SideFlap;
    SlantedFlapBottom.current.rotation.x = -Base2SideFlap;

    SmallCurveFlapTop.current.rotation.x = Base2SideFlap;
    SmallCurveFlapBottom.current.rotation.x = -Base2SideFlap;

    base2LeftHinge.current.rotation.z = Base2CloseHinge;
    base2RightHinge.current.rotation.z = Last;



  });

  return (
    <group>
          {/* BASE PANEL (Bottom panel)*/}
           {/* <Panel
              w={WIDTH} 
              h={LENGTH}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,0,]}
          /> */}
          <BasePanelWithHoles length={LENGTH} width={WIDTH} thickness={THICKNESS} holeHeight={HOLE_HEIGHT} holeWidth={HOLE_WIDTH} />


    {/* Base Top Hinge  */}
        
        <group
        ref={BasetopHinge}
        position={[0,0,-LENGTH/2]}
        >
          {/* Flap1 above base   */}
        <Panel
              w={WIDTH} 
              h={HEIGHT}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,-HEIGHT/2,]}
        />
        
        {/* Gap for fold Hinge*/}

        <group
          ref={BetweenTop}
          position={[0,0,-HEIGHT]}
        >
          {/* panel bwtween to fold */}
          <Panel
              w={WIDTH-FOLD_OFFSET} 
              h={BETWEEN_FLAP}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,-BETWEEN_FLAP/2,]}
          />
          
          {/* top last Flap hinge  */}
          <group
            ref={TopLastFlap}
            position={[0,0,-BETWEEN_FLAP]}
          >
            {/* top Last Flap panel */}
                <Panel
                  w={WIDTH-FOLD_OFFSET} 
                  h={HEIGHT}
                  t={THICKNESS}
                  color="#CBAE91"
                  position={[0,0,-HEIGHT/2,]}
            />
            
            {/* Hole Hinges Left and right for top */}
            <Panel
                w={HOLE_WIDTH} 
                h={HOLE_HEIGHT}
                t={THICKNESS}
                color="#CBAE91"
            position={[HOLE_WIDTH,0,-HEIGHT]}
            />
            <Panel
                w={HOLE_WIDTH} 
                h={HOLE_HEIGHT}
                t={THICKNESS}
                color="#CBAE91"
            position={[-HOLE_WIDTH,0,-HEIGHT]}
            />

          </group>
        </group>


      </group>
      





    {/* Base Bottom Hinge  */}

      <group
        ref={BaseBottomHinge}
        position={[0,0,LENGTH/2]}
        >
          {/* Flap1 below base   */}
        <Panel
              w={WIDTH} 
              h={HEIGHT}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,HEIGHT/2,]}
        />
        

         <group
          ref={BetweenBottom}
          position={[0,0,HEIGHT]}
        >
          {/* panel bwtween to fold */}
          <Panel
              w={WIDTH-FOLD_OFFSET} 
              h={BETWEEN_FLAP}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,BETWEEN_FLAP/2,]}
          />


          {/* Bottom last Flap hinge  */}
            <group
            ref={BottomLastFlap}
            position={[0, 0, BETWEEN_FLAP]}
            >
              {/* Bottom Last Flap panel */}
                <Panel
                  w={WIDTH-FOLD_OFFSET} 
                  h={HEIGHT}
                  t={THICKNESS}
                  color="#CBAE91"
                  position={[0,0,HEIGHT/2,]}
                />

            {/* Hole Hinges Left and right for Bottom */}
            <Panel
                w={HOLE_WIDTH} 
                h={HOLE_HEIGHT}
                t={THICKNESS}
                color="#CBAE91"
            position={[HOLE_WIDTH,0,HEIGHT]}
            />
            <Panel
                w={HOLE_WIDTH} 
                h={HOLE_HEIGHT}
                t={THICKNESS}
                color="#CBAE91"
            position={[-HOLE_WIDTH,0,HEIGHT]}
            />
            

            </group>

        </group>


        </group>





        {/* Left hinge */}
        <group
        ref={leftHingeRef}
        position={[
          -WIDTH / 2, // move hinge to right edge of base
          0,
          0,
        ]}
        >
             {/* Left PANEL */}
        <Panel
          w={HEIGHT}
          h={LENGTH -FOLD_OFFSET}
          t={THICKNESS}
          color="#CBAE91"
          position={[-HEIGHT / 2, 0,0,]}
        />
              {/* Hinge Above the left panel for flap */}
              <group
                  ref={LeftFlapTop}
                  position={[0,0,-(LENGTH-FOLD_OFFSET)/2]}
              >
                  {/* flap above left panel */}
                  <Panel
                    w={HEIGHT-FOLD_OFFSET}
                    h={FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-HEIGHT/2, 0,-FLAP_HEIGHT / 2,]}
                  />
              </group>

              {/* Hinge beloe the left panel for flap */}
              
              <group
                  ref={LeftFlapBottom}
                  position={[0,0,(LENGTH-FOLD_OFFSET)/2]}
              >
                {/* flap below left panel */}
                  <Panel
                    w={HEIGHT-FOLD_OFFSET}
                    h={FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-HEIGHT/2, 0,FLAP_HEIGHT / 2,]}
                  />
              </group>


      </group>
      
          

      {/* RIGHT PANEL HINGE */}
      <group
        ref={rightHingeRef}
        position={[ WIDTH / 2, 0,0,]}
      >
        {/* RIGHT PANEL */}
        <Panel
          w={HEIGHT}
          h={LENGTH-FOLD_OFFSET}
          t={THICKNESS}
          color="#CBAE91"
          position={[
            HEIGHT / 2, 0,0,]}
        />
        
        
              
        {/* Hinge Above the Right panel for flap */}
              <group
                  ref={RightFlapTop}
                  position={[0,0,-(LENGTH-FOLD_OFFSET)/2]}
              >
                  {/* flap above left panel */}
                  <Panel
                    w={HEIGHT-FOLD_OFFSET}
                    h={FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[HEIGHT/2, 0,-FLAP_HEIGHT / 2,]}
                  />
              </group>

        {/* Hinge beloe the Right panel for flap */}
              
              <group
                  ref={RightFlapBottom}
                  position={[0,0,(LENGTH-FOLD_OFFSET)/2]}
              >
                  <Panel
                    w={HEIGHT-(FOLD_OFFSET)}
                    h={FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[HEIGHT/2, 0,FLAP_HEIGHT / 2,]}
                  />
              </group>
        
              
        {/* 2nd base left Hinge */}
        <group
          ref={base2LeftHinge}
          position={[HEIGHT,0,0]}
        >
            {/* 2nd Base panel */}
            <Panel
              w={WIDTH} 
              h={LENGTH-(FOLD_OFFSET*2)}
              t={THICKNESS}
              color="#CBAE91"
              position={[WIDTH/2,0,0,]}
             />  
                  
            
            {/* Base 2 top Flap hinge */}
            <group
              ref={SlantedFlapTop}
            position={[0,0,(-LENGTH/2)+FOLD_OFFSET]}
            >
              {/* Slant top hinge */}
              <SlantedFlap width={WIDTH} height={HEIGHT} thickness={THICKNESS} r={-1} />

            </group>
            
            {/* Base 2 Bottom Flap Hinge */}
            <group
              ref={SlantedFlapBottom}
            position={[0,0,(LENGTH/2)-FOLD_OFFSET]}
            >
              {/* Slant bottom hinge */}
              <SlantedFlap width={WIDTH} height={HEIGHT} thickness={THICKNESS} r={ 1} />

            </group>

            
          
            {/* 2nd base Right panel */}
            <group
                ref={base2RightHinge}
                position={[WIDTH,0,0]}
            >
                    {/* Last Flap Center   */}
                  <Panel
                    w={HEIGHT}
                    h={LENGTH-FOLD_OFFSET}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[ HEIGHT / 2, 0,0,]}
                  />    
            
              {/* Hinge above the last panel for round flap */}
              <group
                  ref={SmallCurveFlapTop}
                  position={[0,0,-(LENGTH-FOLD_OFFSET)/2]}
            >
              {/* curve Flap top  */}
                  <QuarterCircleFlap height={(HEIGHT-(FOLD_OFFSET/2))} thickness={THICKNESS} r={-1}/>
              </group>

              {/* Hinge beloe the last panel for round flap */}
              
              <group
                  ref={SmallCurveFlapBottom}
                  position={[0,0,(LENGTH-FOLD_OFFSET)/2]}
            >
              {/* curve Flap bottom  */}
                 <QuarterCircleFlap height={(HEIGHT-(FOLD_OFFSET/2))} thickness={THICKNESS} r={1}/>
              </group>
            </group>

        </group>
            
      </group>
    </group>
  );
}

export default Fefco0427_3D;


