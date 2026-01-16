import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

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

function Fefco0401_3D({ slider,length,width,height })
{
    const S = 0.01;
    const WIDTH = width * S;
    const LENGTH = length * S;
    const THICKNESS = 0.5 * S;
    const LAST_HEIGHT = LENGTH * 0.4;
    const FOLD_OFFSET = 2 * S;
    const HEIGHT = height * S;
    

    const LeftHinge = useRef();
    const RightHinge = useRef();

    const LeftMostHinge = useRef();
    const RightMostHinge = useRef();

    const TopHinge = useRef();
    const BottomHinge = useRef();
    
    const TopMostHinge = useRef();
    const BottomMostHinge=useRef();


    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const segment = (t, a, b) => {
    if (t <= a) return 0;
    if (t >= b) return 1;
    return easeOutCubic((t - a) / (b - a));
    };

    const foldSide = THREE.MathUtils.degToRad(90 * segment(slider, 0.0, 0.33));
    const foldTop = THREE.MathUtils.degToRad(90 * segment(slider, 0.34, 0.66));
    const foldLast = THREE.MathUtils.degToRad(90 * segment(slider, 0.67, 1));
    console.log(foldSide);

    useFrame(() =>
    {
        LeftHinge.current.rotation.z = -foldSide;
        LeftMostHinge.current.rotation.z = -foldSide;

        RightHinge.current.rotation.z = foldSide;
        RightMostHinge.current.rotation.z = foldSide;

        TopHinge.current.rotation.x = foldTop;
        BottomHinge.current.rotation.x = -foldTop;

        TopMostHinge.current.rotation.x = foldLast;
        BottomMostHinge.current.rotation.x = -foldLast;



    })

    return(
        
        <group>
            {/* Base Panel  */}
            <Panel
              w={LENGTH} 
              h={WIDTH}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,0,]}
            /> 
            {/* Left Hinge of Base */}
            <group
                ref={LeftHinge}
                position={[-LENGTH/2,0,0]}
            >
                {/* Left Panel */}
                <Panel
                w={HEIGHT} 
                h={WIDTH}
                t={THICKNESS}
                color="#CBAE91"
                position={[-HEIGHT/2,0,0,]}
                /> 
                {/* Left Most Hinge  */}
                <group
                    ref={LeftMostHinge}
                    position={[-HEIGHT,0,0]}
                >
                    {/* Left Most Hinge */}
                    <Panel
                    w={LAST_HEIGHT} 
                    h={WIDTH}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-LAST_HEIGHT/2,0,0,]}
                    /> 

                </group>
            </group>


            {/* Right Hinge of Base */}
            <group
                ref={RightHinge}
                position={[LENGTH/2,0,0]}
            >
                {/* Right Panel */}
                <Panel
                w={HEIGHT} 
                h={WIDTH}
                t={THICKNESS}
                color="#CBAE91"
                position={[HEIGHT/2,0,0,]}
                /> 
                {/* Right Most Hinge  */}
                <group
                    ref={RightMostHinge}
                    position={[HEIGHT,0,0]}
                >
                    {/* Left Most Hinge */}
                    <Panel
                    w={LAST_HEIGHT} 
                    h={WIDTH}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[LAST_HEIGHT/2,0,0,]}
                    /> 

                </group>
            </group>


            {/* Panel above base */}

            <group
                ref={TopHinge}
                position={[0,0,-WIDTH/2]}
            >
                {/* top Panel */}

                <Panel
                    w={LENGTH} 
                    h={HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[0,0,-HEIGHT/2]}
                /> 

                {/* top Most Hinge */}

                <group
                    ref={TopMostHinge}
                    position={[0,0,-HEIGHT]}
                >
                    {/* top Most panel */}
                    <Panel
                    w={LENGTH} 
                    h={WIDTH/2}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[0,0,-WIDTH/4]}
                    /> 

                </group>

            </group>

            {/* bottom panel Hinge */}

            <group
                ref={BottomHinge}
                position={[0,0,WIDTH/2]}
            >
                {/* Bottom Panel */}

                <Panel
                    w={LENGTH} 
                    h={HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[0,0,HEIGHT/2]}
                /> 

                {/* Bottom Most Hinge */}

                <group
                    ref={BottomMostHinge}
                    position={[0,0,HEIGHT]}
                >
                    {/* Bottom Most panel */}
                    <Panel
                    w={LENGTH} 
                    h={WIDTH/2}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[0,0,WIDTH/4]}
                    /> 

                </group>

            </group>

            

        </group>
    );

}


export default Fefco0401_3D;
