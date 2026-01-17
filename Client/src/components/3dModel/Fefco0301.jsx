import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";


function mapRange(slider, min1, max1, min2, max2, height,minEnd = 0.06) {
  const forward =
    ((slider - min1) / (max1 - min1)) * height;

  const reverse =
    height - ((slider - min2) / (max2 - min2)) * height;

  return Math.min(
    height,
    Math.max(minEnd, Math.min(forward, reverse))
  );
}


function mapRangeReverse(slider, sliderMin, sliderMax, initial, last) {
  const t = (slider - sliderMin) / (sliderMax - sliderMin);
  return Math.min(
    initial,
    Math.max(
      last,
      initial - t * (initial - last)
    )
  );
}



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

function Fefco0301_3D({ slider,length,width,height })
{
    const S = 0.1;
    const WIDTH = width * S;
    const LENGTH = length * S;
    const THICKNESS = 0.5 * S;
    const FOLD_OFFSET = 2 * S;
    const HEIGHT = height * S;
    
    const TOP = 1 * S;
    const DISTANCE = 15 * S
    
    const MaxDistance=DISTANCE+HEIGHT
    
    const TEMP = LENGTH * 0.25;
    const SIDE_FLAP_HEIGHT = TEMP <= HEIGHT ? TEMP : HEIGHT + (FOLD_OFFSET / 2)
    
    

    const LeftHinge = useRef();
    const LeftTopHinge = useRef();
    const LeftBottomHinge = useRef();
    const RightHinge = useRef();
    const RightTopHinge = useRef();
    const RightBottomHinge=useRef();

    const TopHinge = useRef();
    const BottomHinge = useRef();

    const TopBox = useRef();
    const TopBaseRight = useRef();
    const TopBaseLeft = useRef();
    
    const RightTopHinge_TB = useRef();
    const RightBottomHinge_TB = useRef();

    const LeftTopHinge_TB = useRef();
    const LeftBottomHinge_TB = useRef();

    const TopHinge_TB = useRef();
    const BottomHinge_TB = useRef();

    
    

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const segment = (t, a, b) => {
    if (t <= a) return 0;
    if (t >= b) return 1;
    return easeOutCubic((t - a) / (b - a));
    };

    const foldSide = THREE.MathUtils.degToRad(90 * segment(slider, 0.0, 0.20));
    const foldTop = THREE.MathUtils.degToRad(90 * segment(slider, 0.20, 0.40));
    const foldLast = THREE.MathUtils.degToRad(90 * segment(slider, 0.40, 0.60));
    const align=THREE.MathUtils.degToRad(90 * segment(slider, 0.70, 0.90));

    const Height_OF_Elivation=mapRange(slider,0.60,0.80,0.90,1,HEIGHT+DISTANCE+FOLD_OFFSET)
    const Distance_Between_Box = mapRangeReverse(slider, 0.60, 0.80, MaxDistance, TOP / 2)
    
    console.log(Height_OF_Elivation);

    useFrame(() =>
    {

        LeftTopHinge.current.rotation.x = foldSide;
        RightTopHinge.current.rotation.x = foldSide;
        RightTopHinge_TB.current.rotation.x = foldSide;
        LeftTopHinge_TB.current.rotation.x = foldSide;

        RightBottomHinge.current.rotation.x=-foldSide
        LeftBottomHinge.current.rotation.x = -foldSide;
        RightBottomHinge_TB.current.rotation.x = -foldSide;
        LeftBottomHinge_TB.current.rotation.x = -foldSide;


        LeftHinge.current.rotation.z = -foldTop;
        RightHinge.current.rotation.z = foldTop;
        TopBaseLeft.current.rotation.z = -foldTop;
        TopBaseRight.current.rotation.z=-foldTop;
        
        

        TopHinge.current.rotation.x = foldLast;
        BottomHinge.current.rotation.x = -foldLast;
        TopHinge_TB.current.rotation.x = foldLast;
        BottomHinge_TB.current.rotation.x = -foldLast;

        TopBox.current.rotation.z = -align;


    })

    return(
        
        <group>
            {/* Base Panel   */}
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
                h={WIDTH-(FOLD_OFFSET)}
                t={THICKNESS}
                color="#CBAE91"
                position={[-(HEIGHT)/2,0,0,]}
                /> 

                
                {/* Left panel top Hinge */}
                <group
                    ref={LeftTopHinge}
                    position={[0,0,-(WIDTH-(FOLD_OFFSET))/2]}
                >

                    <Panel
                    w={HEIGHT} 
                    h={SIDE_FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-(HEIGHT)/2,0,-SIDE_FLAP_HEIGHT/2]}
                        /> 
                    
                </group>

                {/* Left Bottom Hinge */}
                <group
                    ref={LeftBottomHinge}
                    position={[0,0,(WIDTH-(FOLD_OFFSET))/2]}
                >
                    {/* Left Bottom Flap */}
                    <Panel
                    w={HEIGHT} 
                    h={SIDE_FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-(HEIGHT)/2,0,SIDE_FLAP_HEIGHT/2]}
                        /> 
                    
                </group>
                
            </group>

            
            {/* Right Hinge  */}
             <group
                ref={RightHinge}
                position={[LENGTH/2,0,0]}
            >
                {/* Right Panel */}
                <Panel
                w={HEIGHT} 
                h={WIDTH-(FOLD_OFFSET)}
                t={THICKNESS}
                color="#CBAE91"
                position={[(HEIGHT)/2,0,0,]}
                /> 

                
                {/* Right Top Hinge */}
                <group
                    ref={RightTopHinge}
                    position={[0,0,-(WIDTH-(FOLD_OFFSET))/2]}
                >
                    {/* Right Top Flap */}
                    <Panel
                    w={HEIGHT} 
                    h={SIDE_FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[(HEIGHT)/2,0,-SIDE_FLAP_HEIGHT/2]}
                    /> 
                    
                </group>
                
                {/* Right panel Bottom Hinge */}
                <group
                    ref={RightBottomHinge}
                    position={[0,0,(WIDTH-(FOLD_OFFSET))/2]}
                >
                    {/* right Bottom flap */}
                    <Panel
                    w={HEIGHT} 
                    h={SIDE_FLAP_HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[(HEIGHT)/2,0,SIDE_FLAP_HEIGHT/2]}
                        /> 
                    
                </group>

                
                
            </group>
            
            {/* Top Hinge  */}
            <group
                ref={TopHinge}
                position={[0,0,-WIDTH/2]}
            >
                {/* Top Panel */}
                <Panel
              w={LENGTH-FOLD_OFFSET} 
              h={HEIGHT}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,0-HEIGHT/2,]}
            /> 
            </group>

            {/* Bottom Hinge */}
            <group
                ref={BottomHinge}
                position={[0,0,WIDTH/2]}
            >
                {/* Bottom Panel */}
                <Panel
              w={LENGTH-FOLD_OFFSET} 
              h={HEIGHT}
              t={THICKNESS}
              color="#CBAE91"
              position={[0,0,HEIGHT/2,]}
            /> 
            </group>

            


            {/* Top Box Logic -----------------------.............................*/}
            <group
                ref={TopBox}
                position={[-LENGTH/2-Distance_Between_Box,Height_OF_Elivation,0]}
            >

                {/* Right Panel Of Top box*/}
                <Panel
                w={HEIGHT+TOP} 
                h={WIDTH}
                t={THICKNESS}
                color="#CBAE91"
                position={[-(HEIGHT+TOP)/2,0,0,]}
                />

                {/* top hinge of right panel TOP BOX */}
                <group
                ref={RightTopHinge_TB}
                position={[0,0,-WIDTH/2]}
                >
                    {/* Right Top Flap */}
                    <Panel
                    w={HEIGHT+TOP} 
                    h={SIDE_FLAP_HEIGHT+TOP}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-(HEIGHT+TOP)/2,0,-SIDE_FLAP_HEIGHT/2]}
                    /> 
                </group>

                {/* Bottom hinge of right panel TOP BOX */}


                <group
                ref={RightBottomHinge_TB}
                position={[0,0,WIDTH/2]}
                >
                    {/* Right Top Flap */}
                    <Panel
                    w={HEIGHT+TOP} 
                    h={SIDE_FLAP_HEIGHT+TOP}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-(HEIGHT+TOP)/2,0,SIDE_FLAP_HEIGHT/2]}
                    /> 
                </group>


                {/* Top Base right hinge */}
                <group
                    ref={TopBaseRight}
                    position={[-HEIGHT,0,0]}
                >
                    {/* top box base panel */}
                    <Panel
                    w={LENGTH+TOP} 
                    h={WIDTH+TOP}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[-(LENGTH+TOP)/2,0,0,]}
                    /> 

                    {/* Left Side of Top Box hinge */}


                    <group
                        ref={TopBaseLeft}
                        position={[-(LENGTH+TOP),0,0]}
                    >
                        {/* left Panel of Top box */}
                        <Panel
                        w={HEIGHT+TOP} 
                        h={WIDTH+TOP}
                        t={THICKNESS}
                        color="#CBAE91"
                        position={[-(HEIGHT+TOP)/2,0,0,]}
                        />

                        
                        <group
                        ref={LeftTopHinge_TB}
                        position={[0,0,-WIDTH/2]}
                        >
                            {/* Right Top Flap */}
                            <Panel
                            w={HEIGHT+TOP} 
                            h={SIDE_FLAP_HEIGHT+TOP}
                            t={THICKNESS}
                            color="#CBAE91"
                            position={[-(HEIGHT+TOP)/2,0,-SIDE_FLAP_HEIGHT/2]}
                            /> 
                        </group>

                        {/* Bottom hinge of right panel TOP BOX */}


                        <group
                        ref={LeftBottomHinge_TB}
                        position={[0,0,(WIDTH+TOP)/2]}
                        >
                            {/* Right Top Flap */}
                            <Panel
                            w={HEIGHT+TOP} 
                            h={SIDE_FLAP_HEIGHT+TOP}
                            t={THICKNESS}
                            color="#CBAE91"
                            position={[-(HEIGHT+TOP)/2,0,SIDE_FLAP_HEIGHT/2]}
                            /> 
                        </group>

                    </group>


                    
                    

                    {/* top Box pase pannel Top hinge */}
                    <group
                        ref={TopHinge_TB}
                        position={[0,0,-(WIDTH+TOP)/2]}
                    >
                    {/* Top Panel */}
                    <Panel
                    w={LENGTH-FOLD_OFFSET} 
                    h={HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[(-LENGTH-FOLD_OFFSET)/2,0,0-HEIGHT/2,]}
                    /> 
                    </group>

                    
                    {/* top Box pase pannel Bottom hinge */}
                    <group
                        ref={BottomHinge_TB}
                        position={[0,0,(WIDTH+TOP)/2]}
                    >
                    {/* Bottom Panel */}
                    <Panel
                    w={LENGTH-FOLD_OFFSET} 
                    h={HEIGHT}
                    t={THICKNESS}
                    color="#CBAE91"
                    position={[(-LENGTH-FOLD_OFFSET)/2,0,HEIGHT/2,]}
                    /> 
                    </group>
                        

                </group>

            </group>
        </group>
    );

}


export default Fefco0301_3D;
