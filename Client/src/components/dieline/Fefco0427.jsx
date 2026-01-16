
import React from "react";

export default function Fefco0427Dieline(props)
{
    const x = 130.5;
    const y = 271.5;
    let length = 368;
    let height = 72;
    let width = 236;
    let hole_height = 6;
    let hole_width = width / 5;
    
    const leftSideX = x;                  
  
    const frontX = leftSideX + width; //130.5 + 236 = 366.5   
  const rightSideX = frontX + height;  //366.5 + 72= 438.5
  const backX = rightSideX + width+1;     // 438.5 + 236= 675.5
    const endX = backX + height;  // 675.5 + 72 = 746.5
    
    const creaseOffset = 2;
    const trimOffset = 3;
    const foldOffset = 4;
    const flapOffset = 20;
    const leftEdgeX = x - height;
    const lowerY = y + length; // 639.5
    const midFlap = lowerY + height;
    const creaseBetween = 6;
    const loweryEdge=midFlap+creaseBetween+height-creaseOffset;
    const midY = y + (length / 2);
    const upperEgde = y - (2 * height) - creaseBetween+ creaseOffset;
    const flapY = lowerY - hole_height+height;
    const flapHeightBeforeCurve = flapY - 12;  //693.5
    const upperY = y - height;
    const flapHeightBeforeCurveUp = upperY+hole_height+12;
    const flapYupper=y+hole_height-height;//
   // console.log(flapY - creaseOffset);
  return (
   <svg width="1970" height="1432" viewBox="0 0 1970 1432" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="20_DieLine">

{/* Crease rectangle  */}
<rect id="crease_panel_left" x={x} y={y} width={width} height={length} stroke="#FF0000" stroke-dasharray="1 1"/>
<rect id="crease_panel_right" x={rightSideX} y={y+creaseOffset+foldOffset} width={width+creaseOffset} height={length-(hole_height*2)} stroke="#FF0000" stroke-dasharray="1 1"/>

              

{/* left to rectangle top crease and bottom crease */}
<line id="left_top" x1={leftSideX-height+creaseOffset} y1={y+creaseOffset} x2={x-creaseOffset} y2={y+creaseOffset} stroke="#FF0000" stroke-dasharray="1 1"/>
<line id="left_bottom" x1={leftSideX-height+creaseOffset} y1={lowerY-creaseOffset} x2={x-creaseOffset} y2={lowerY-creaseOffset} stroke="#FF0000" stroke-dasharray="1 1"/>

{/* right to rectangle top crease and bottom crease */}
<line id="right_top" x1={backX+creaseOffset} y1={y+creaseOffset} x2={endX} y2={y+creaseOffset} stroke="#FF0000" stroke-dasharray="1 1"/>
<line id="right_bottom" x1={backX+creaseOffset} y1={y + length - creaseOffset} x2={endX} y2={y + length - creaseOffset} stroke="#FF0000" stroke-dasharray="1 1" />
            
{/* between rectangle top crease and bottom crease */}
<line id="center_bottom" x1={frontX+creaseOffset} y1={lowerY-creaseOffset} x2={rightSideX} y2={lowerY-creaseOffset} stroke="#FF0000" stroke-dasharray="1 1"/>
<line id="center_top" x1={frontX+creaseOffset} y1={y+creaseOffset} x2={rightSideX} y2={y+creaseOffset} stroke="#FF0000" stroke-dasharray="1 1"/>
          

{/* line Bottom of left crease  */}
<line id="bottom_first" x1={x} y1={lowerY+height} x2={frontX} y2={lowerY+height} stroke="#FF0000" stroke-dasharray="1 1" />
<line id="bottom_second" x1={x+creaseOffset} y1={lowerY+height+creaseOffset+foldOffset+1} x2={frontX-creaseOffset} y2={lowerY+height+creaseOffset+foldOffset+1} stroke="#FF0808" stroke-dasharray="1 1"/>

{/* line top of left crease  */}
<line id="top_first" x1={x} y1={y-height} x2={frontX} y2={y-height} stroke="#FF0000" stroke-dasharray="1 1"/>
<line id="top_second" x1={x+creaseOffset} y1={y-height-creaseOffset-foldOffset-1}  x2={frontX-creaseOffset} y2={y-height-creaseOffset-foldOffset-1} stroke="#FF0808" stroke-dasharray="1 1"/>

<path id="bleed_lower_half" d="M54 455V737H126.5V793.263H175L177.5 797.5H226L228.5 793.5H268.5L270.5 797.5H319.304L322 793.5H370.5V738H443.5V663L454.5 693.5C458.62 704.064 463.19 707.809 476 710H642C654.142 705.603 658.123 700.022 662 686.5L671.5 661V706C721.189 702.085 738.349 689.42 751 649.5L751.5 640.5L754.5 637V446" stroke="#4CBA33"/>
<path id="bleed_upper_half" d="M54 455.5V173.5H126.5V117.237H175L177.5 113H226L228.5 117H268.5L270.5 113H319.304L322 117H370.5V172.5H443.5V247.5L454.5 217C458.62 206.436 463.19 202.691 476 200.5H642C654.142 204.897 658.123 210.478 662 224L671.5 249.5V204.5C721.189 208.415 738.349 221.08 751 261L751.5 270L754.5 273.5V464.5" stroke="#4CBA33"/>


<path id="trim_lower_half"
    d={`M${leftEdgeX} ${midY}
        V${midFlap + flapOffset}
        H${leftSideX - trimOffset}
        V${lowerY - trimOffset}
        
        H${leftSideX}
        V${midFlap}
        L${x + creaseOffset} ${midFlap + creaseBetween}
        
        V${loweryEdge}
        H${leftSideX + hole_width + creaseOffset}
        
        L${leftSideX + hole_width + foldOffset} ${loweryEdge + foldOffset}
        
        H${leftSideX + (hole_width * 2) - creaseOffset}
        
        L${leftSideX+(hole_width*2)} ${loweryEdge}
        H${leftSideX + (hole_width * 3) }
        
        L${leftSideX + (hole_width * 3)+creaseOffset} ${loweryEdge + foldOffset}
        
        H${leftSideX+(hole_width*4)-trimOffset}
        L${leftSideX+(hole_width*4)} ${loweryEdge }
        H${frontX-creaseOffset}
        V${midFlap+creaseBetween}
        L${frontX} ${midFlap}

        
        V${lowerY-creaseOffset}
        H${frontX+trimOffset}
        V${midFlap + flapOffset}
        H${rightSideX - 1}
        
        V${lowerY-foldOffset-2}
        H${rightSideX+creaseOffset}
        L${rightSideX + flapOffset + creaseOffset} ${flapHeightBeforeCurve}
        
        C${rightSideX + flapOffset + creaseOffset+4} ${flapHeightBeforeCurve+8} 
         ${rightSideX + flapOffset + creaseOffset+8} ${flapHeightBeforeCurve+8+2} 
         ${rightSideX+flapOffset+creaseOffset+16} ${flapY-1}
        
        H${backX-creaseOffset-flapOffset-14}
        
        C${backX-creaseOffset-flapOffset-14+8} ${flapHeightBeforeCurve+8+2} 
        ${backX-creaseOffset-flapOffset-14+8+4} ${flapHeightBeforeCurve+8} 
        ${backX - flapOffset - creaseOffset} ${flapHeightBeforeCurve}
        
        L${backX} ${lowerY-hole_height}

        H${backX + creaseOffset}
        
        V${flapY-foldOffset}
        
        C ${718.629} ${697.6} 
        ${735.116} ${687.065} 
        ${endX} ${648}
        V${lowerY}
        L${endX+1} ${lowerY-foldOffset}
        V${midY}`}
        stroke="#4E33BA" />
              


<path id="trim_upper_half" 
d={`M${leftEdgeX} ${midY}
    V${upperY-flapOffset}
    H${leftSideX - trimOffset}
    
    V${y+trimOffset}

    H${leftSideX}
    V${y-height}
    L${x + creaseOffset} ${y-height-creaseBetween}

    V${upperEgde}
    H${leftSideX + hole_width + creaseOffset}

    L${leftSideX + hole_width + foldOffset} ${upperEgde-foldOffset}

    H${leftSideX + (hole_width * 2) - creaseOffset}


    L${leftSideX+(hole_width*2)} ${upperEgde}
    H${leftSideX + (hole_width * 3) }
    
    L${leftSideX + (hole_width * 3) + creaseOffset} ${upperEgde-foldOffset}
    
    H${leftSideX+(hole_width*4)-trimOffset}
    L${leftSideX+(hole_width*4)} ${upperEgde}
    H${frontX-creaseOffset}
    V${y-height-creaseBetween}
    L${frontX} ${y-height}


    V${y+creaseOffset}
    H${frontX+trimOffset}
    V${upperY-flapOffset}
    H${rightSideX - 1}


    V${y+hole_height}
    H${rightSideX+creaseOffset}
    L${rightSideX + flapOffset + creaseOffset} ${flapHeightBeforeCurveUp}


    C${464.401} ${210.471} 
    ${468} ${208} 
    ${rightSideX+flapOffset+creaseOffset+16} ${207}

    H${backX - creaseOffset - flapOffset - 16}

    C${647.5} ${208} ${651} ${210.5} ${backX-flapOffset-creaseOffset} ${flapHeightBeforeCurveUp}

    L${backX} ${y+hole_height}


    H${backX + creaseOffset}
    
    V${flapYupper+foldOffset}
    
    C${718.629} ${213.9} 
    ${735.116} ${224.435} 
    ${endX} ${263.5}
    V${y}
    L${endX+1} 276.5
    V${midY}`} stroke="#4E33BA" />


{/* holes on crease_panel_left to secure the top flap */}
<rect id="hole_1" x={x + hole_width} y={y} width={hole_width} height={hole_height} rx="3" stroke="#4E33BA" />
<rect id="hole_2" x={x+(hole_width*3)} y={y} width={hole_width} height={hole_height} rx="3" stroke="#4E33BA"/>
<rect id="hole_3" x={x+hole_width} y={lowerY-hole_height} width={hole_width} height={hole_height} rx="3" stroke="#4E33BA"/>
<rect id="hole4" x={x+(hole_width*3)} y={lowerY-hole_height} width={hole_width} height={hole_height} rx="3" stroke="#4E33BA"/>
</g>
</svg>

  );
}
