
import styled from "styled-components";
import React, { use, useCallback, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import * as ga from '../../../lib/ga';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ReactMarkdown from "react-markdown";
import LinearProgress from '@mui/material/LinearProgress';
import ImageData from "../../../lib/image-data";
//import PopoutCard from "./new-popout-card";
import EmptyImage from "../empty-image";
import useWindowSize from "../../hooks/window-size";
//import CardHeadline from "./editor/card-headline";
//import CardBody from "./editor/card-body";
//import CardSignature from "./editor/card-signature";
//import CardImage from "./editor/card-image";
//import TextToolbar from "./editor/toolbars/text";

import { useCanvas } from "../../hooks/use-canvas";
import { fabric } from "fabric";
import { Caveat } from 'next/font/google';
import recordGif from '../../../lib/gif-recorder';
import recordWebm from '../../../lib/webm-recorder';
//import { Preview } from "react-markdown-editor-lite/cjs/editor/preview";

const caveat = Caveat({ subsets: ['latin'] });
interface BodyProps {
  l: number;
  large?: boolean;
}

interface LargeProps {
  large?: boolean,
  open?: boolean,
  dark?: string,
}
const Image = styled.img<LargeProps>`

    object-fit: cover;
    max-width: ${({ large }) => large ? 3 * 110 : 240}px;
    max-height: ${({ large }) => large ? 4 * 110 : 320}px;
    width:100%;//${({ large }) => large ? 50 : 45}vw;
    height:100%;// ${({ large }) => large ? 75 : 60}vw;
    margin-left:5px;
   // border-radius: 5px;  
    transform: rotateY(180deg);  
    visibility:hidden;

   
`;
const Card = styled.div<LargeProps>`
position:relative;
margin-top:20px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;


//box-shadow: inset 0 0 10px #000000;
&body {
    text-align: center;
   // background: gray;   
  }
  .card__container {
    //cursor: pointer;

    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    left: 0px;//0%;
    top: 0px;//50%;
    transform: ${({ open, large }) => `translate(-${open ? large ? 0 : 0 : large ? 25 : 30}%, -50%)`};
    perspective: 3700px;
    transition: all 0.2s ease;
    margin-top:${({ open, large }) => open ? large ? 120 : 120 : 40}px;
    margin-bottom:${({ open, large }) => open ? large ? 120 : 100 : 20}px;
    @media (min-width: 600px) {
      margin-top:${({ open, large }) => open ? large ? 150 : 120 : 40}px;
      margin-bottom:${({ open, large }) => open ? large ? 70 : 100 : 20}px;
    }
    @media (min-width: 900px) {
      margin-top:${({ open, large }) => open ? large ? 150 : 120 : 40}px;   
      margin-bottom:${({ open, large }) => open ? large ? 70 : 100 : 20}px;
    }
   
  }
  @media (min-width: 768px) {
    margin-top:20px;
    .open .card__container {
      transform: translate(0%, 20%);       
    }
  }
  .card {
    margin:5px;
    max-width: ${({ large }) => large ? 2 * 3 * 100 : 240}px;
    max-height: ${({ large }) => large ? 4 * 100 : 320}px;
    width:${({ large }) => large ? 2 * 16 * 3 + 20 : 45}vw;
    height: ${({ large }) => large ? 16 * 4 : 60}vw;
    transform-style: preserve-3d;
    transform: rotateX(65deg);
    transition: all 1s ease;
   // box-shadow: 0 3px 10px rgb(0 0 0 / 0.8);
    //transform: translate(0%, 0%);
    @media (min-width: 768px) {
        width:${({ large }) => large ? 2 * 80 : 60}vw;
        height: ${({ large }) => large ? 60 : 45}vw;     
  }
  }
  .open .card {
    transform: rotateX(0deg);   
  }
  .card__panel {
   // border: 1px solid black;
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: space-between;
   // place-items: center;
    transition: all 6s ease;
    backface-visibility: visible;
    transform-origin: left;
    transform-style: preserve-3D;
    transform: rotate3d(0, 1, 0, 0deg);
  }
  .card__panel--front {
    left: 50px;
    visibility:hidden;
    backface-visibility: hidden;
    background: #6288e6;
    z-index: 1; 
    margin-left:-15px;
    
  }
  .open .card__panel--front {
    left: 50%;
    margin-left:-15px;
    transform: rotate3d(0, 1, 0, -170deg);   
  }
  .card__panel--inside-left {
    left: 50%;
    background: #fff;
    z-index: 0;
    
  }
  .open .card__panel--inside-left {
    left: 50%;
    transform: rotate3d(0, 1, 0, -170deg);
    box-shadow: 0 3px 10px rgb(${({ dark }) => (dark == 'true') ? '255 255 255' : '0 0 0'} / 0.2);
  }
  .card__panel--inside-right {
    left: 50%;
    border-left: none;
    background: #fff;
    z-index: -1;
    box-shadow: 0 3px 10px rgb(${({ dark }) => (dark == 'true') ? '255 255 255' : '0 0 0'} / 0.2);
  }
  `;
const InvertText = styled.div`
  width:100%;
  transform: rotate3d(0, 1, 0, -170deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-overflow: ellipsis;
  overflow: wrap;
  font-size: 24px;
  cursor: pointer;
 
  z-index: 100;
`;
const BandContainer = styled.div<{ darktext?: string, background?: string, open?: boolean, large?: boolean }>`
    display: flex;
    position:relative;
   
   //padding-top:100px;
   // margin-top: 80px;
   // margin-right:5%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-bottom:300px;
    margin-top:40px;
    //padding-left:1%;
   // padding-right:4%;
   // padding: 14rem 2rem;
    text-align: center;
    color:${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
    background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
    //background-image: ${({ background }) => background ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})` : null}; 
  //  background-repeat: repeat;
  //  min-height:300px;
   // width:100%;
   
    // height:${({ open, large }) => open ? large ? 200 : 250 : large ? 200 : 120}px;

    @media (min-width: 900px) {
      margin-bottom:100px;
      height:${({ open, large }) => open ? large ? 290 : 300 : large ? 200 : 120}px;

    }
    @media (min-width: 600px) {
      height:${({ open, large }) => open ? large ? 280 : 250 : large ? 200 : 120}px;
      margin-bottom:150px;

    }
   // padding-bottom:40px;
   
   // background-size: 900px 491px;
`;
const Body = styled.div`
    //padding-top:200px;
    //position:absolute;
    //width:100vw;
    height:100%;
    display:flex;
   // top:1vw;
    flex-direction:column;
   // height:300px;
    //max-height:600px;
    justify-content:space-between;
   // align-items:center;
    z-index:101;
    //height:50vw;
   // padding-left:25%;
    transition: all 1s ease;
  
    
    `;
const Outer = styled.div`
    position:relative;
  
   // width:100%;
    
   // height:auto;
    //padding-top:40px;
    //min-height: 30vw;
    //display:flex;
   // flex-direction:column;
   // justify-content:center;
   // align-items:center;
    //padding-left:40px;
    @media (min-width: 768px) {
      //  width: 30vw;
       // min-height: 15vw;
        
  }
`

const CTAButton = styled(Button)`
    position:relative;
    bottom:0px;
    right:0px;
    width:180px;
    // margin-top: 12rem;
`;
const Inner = styled.div`
    position:relative;  
   /* / padding-bottom:40px; */
  // height:100vh;
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    margin-left: 4px;
    margin-right: 4px;
    margin-top:4px;  
    overflow:clip;
`;

const SignatureLine = styled(Typography) <BodyProps>`
    padding:0px;
    text-align:left;
    font-family:Caveat;
    font-size:28px;
    //font-size:${({ large }) => large ? 3 : 9}px !important;
    @media (max-width: 769px) {    
       font-size:11px;
    }
    `;
interface MarkProps {
  image: string;
}
const Mark = styled.div<MarkProps>`
    position: ${({ image }) => image == "true" ? 'absolute' : 'relative'};
    bottom:0;
    height:100%;
    width:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
`;
const CanvasBox = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  `;
interface Props {
  dark: string,
  fbclid: string,
  utm_content: string,
  text: string,
  image?: ImageData,
  signature: string,
  session?: any;
  linkid: string;
  create: boolean;

}
const GreetingCard: React.FC<Props> = ({ create, linkid, dark, fbclid, utm_content, text, image, signature, session }) => {

  const [online, setOnline] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const [hugeLeft, setHugeLeft] = React.useState(false);
  const [hugeRight, setHugeRight] = React.useState(false);
  const [gifImage, setGifImage] = React.useState("");
  const theme = useTheme();
  const router = useRouter();
  const size = useWindowSize();
  const handleCTAClick = () => {
    router.push(`/start?fbclid=${fbclid}&utm_content=${utm_content}`);
  };
  // console.log("large=", large, "greeting=", text)
  if (!text)
    text = JSON.stringify({ headline: "", body: "" });
  text = text.replace(/\n\n/g, '\n');
  const structuredText = JSON.parse(text);
  // console.log("structuredText=", structuredText)
  //const tw = text.split('\n');

  const headline = structuredText.headline || "";//tw.length > 1 ? tw[0] : '';
  const body = structuredText.body || "";//tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
  console.log("greeting-card render", { dark, image, text, headline, body, signature })
  useEffect(() => {
    setOnline(true);
    setWidth(size.width);

  }, []);
  const handleTextClick = () => {

  }
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const widthRef = useRef<number>(0);
  useEffect(() => {
    widthRef.current = size.width;
    setWidth(size.width)
    setTimeout(() => setOpen(true), 500);
  }, [size, size.width]);
  console.log("width:", widthRef.current, size.width, width)
  const [canvasRef, setCanvasElRef] = useCanvas((canvas) => {
    /**
     * 
     *  MAIN CANVAS RENDERING FUNCTION
     * 
     * 
     */



    canvas.setDimensions({
      width: 700,
      height: 600
    });
    /* const text = new fabric.Text("Hello 66 World ", {
       originX: "center",
       top: 20
     });
     canvas.add(text);
     text.centerH();
     */


    /*function animate(toState: any) {
      text.animate("scaleX", Math.max(toState, 0.4) * 2, {
        onChange: () => canvas.renderAll(),
        onComplete: () => animate(!toState),
        duration: 200,
        easing: toState
          ? fabric.util.ease.easeInOutQuad
          : fabric.util.ease.easeInOutSine
      });
    }
    animate(1);*/


  });
  function preview() {
    const canvas = canvasRef?.current;
    if (!canvas)
      return;
    canvas.clear();
    canvas.backgroundColor = 'white';
   /* const leftPanel = new fabric.Rect({
      width: 300,
      height: 400,
      fill: 'red',
      originX: 'left',
      originY: 'top',
      left: 300,
      top: 0,
      //flipX:true
    }); */

    const rightPanel = new fabric.Rect({
      width: 300,
      height: 400,
      fill: 'blue',
      originX: 'left',
      originY: 'top',
      left: 300,
      top: 0
    });
   // canvas.add(leftPanel);
    canvas.add(rightPanel);
    let leftPanel:any=null;
    var imgElement = document.getElementById('hid-image');
    if (imgElement) {
      //@ts-ignore
      leftPanel = new fabric.Image(imgElement, {
        width: 300,
        height: 400,
        fill: 'red',
        originX: 'left',
        originY: 'top',
        left: 300,
        top: 0,
        //angle: 30,
        //opacity: 0.85
      });
     
      canvas.add(leftPanel);
      leftPanel.bringToFront();
    }
    function animate(toState: any) {
      if (!canvas) return;
      rightPanel.animate("skewY", toState ? '2' : '0', {
        onChange: () => canvas.renderAll(),
        duration: 200,
      });
      leftPanel.animate("skewY", toState ? '40' : '0', {
        onChange: () => canvas.renderAll(),
        duration: 200,
        // easing:fabric.util.ease.easeInSine
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
      leftPanel.animate("width", toState ? '90' : '0', {
        onChange: () => canvas.renderAll(),
        duration: 200,
        // easing:fabric.util.ease.easeInSine
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
    }
    function animate21(toState: any) {
      if (!canvas) return;
      //leftPanel.left=250;
      // leftPanel.flipX=true;
      /* leftPanel.animate("flipX", toState ? '1' : '0', {
         //leftPanel.animate("flipX", toState ? '1' : '0', {
         onChange: () => canvas.renderAll(),
         //onComplete: () => animate(!toState),
         duration: 1,
         easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine
       });*/

      leftPanel.animate("skewY", toState ? '90' : '0', {
        onChange: () => canvas.renderAll(),
        //onComplete: () => animate(!toState),
        duration: 50,
        //  easing:fabric.util.ease.easeOutCubic
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
      leftPanel.animate("width", toState ? '0' : '0', {
        onChange: () => canvas.renderAll(),
        //onComplete: () => animate(!toState),
        duration: 50,
        //   easing:fabric.util.ease.easeOutCubic
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
    }
    function animate22(toState: any) {
      if (!canvas) return;
      //leftPanel.left=50;
      leftPanel.flipX = true;
      //leftPanel.left=220;
      leftPanel.set('left', 210);
      /* leftPanel.animate("flipX", toState ? '1' : '0', {
         //leftPanel.animate("flipX", toState ? '1' : '0', {
         onChange: () => canvas.renderAll(),
         //onComplete: () => animate(!toState),
         duration: 1,
         easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine
       });*/
      /* leftPanel.animate("left", toState ? '210' : '0', {
         onChange: () => canvas.renderAll(),
         //onComplete: () => animate(!toState),
         duration: 5000,
       //  easing:fabric.util.ease.easeOutCubic
       }) */


      leftPanel.animate("skewY", toState ? '40' : '0', {
        onChange: () => canvas.renderAll(),
        //onComplete: () => animate(!toState),
        duration: 50,
        //  easing:fabric.util.ease.easeOutCubic
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
      leftPanel.animate("width", toState ? '90' : '0', {
        onChange: () => canvas.renderAll(),
        //onComplete: () => animate(!toState),
        duration: 20,
        //   easing:fabric.util.ease.easeOutCubic
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
    }
    function animate3(toState: any) {
      if (!canvas) return;
      //leftPanel.left=50;
      // leftPanel.flipX=true;
      /* leftPanel.animate("flipX", toState ? '1' : '0', {
         //leftPanel.animate("flipX", toState ? '1' : '0', {
         onChange: () => canvas.renderAll(),
         //onComplete: () => animate(!toState),
         duration: 1,
         easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine
       });*/

      rightPanel.animate("skewY", toState ? '0' : '0', {
        onChange: () => canvas.renderAll(),
        duration: 200,
      });
      leftPanel.animate("left", toState ? '0' : '0', {
        onChange: () => canvas.renderAll(),
        //onComplete: () => animate(!toState),
        duration: 500,
        easing: fabric.util.ease.easeOutCubic
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine*/
      })
      leftPanel.animate("skewY", toState ? '0' : '0', {
        onChange: () => canvas.renderAll(),
        //onComplete: () => animate(!toState),
        duration: 500,
        easing: fabric.util.ease.easeOutCubic
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
      leftPanel.animate("width", toState ? '300' : '0', {
        onChange: () => canvas.renderAll(),
        //onComplete: () => animate(!toState),
        duration: 500,
        easing: fabric.util.ease.easeOutCubic
        /* easing: toState
           ? fabric.util.ease.easeInOutQuad
           : fabric.util.ease.easeInOutSine */
      });
    }
    animate(1);
    setTimeout(() => animate21(1), 200);
    setTimeout(() => animate22(1), 250);
    setTimeout(() => animate3(1), 300);
  }

  //canvasRef?.current?.renderAll();
  const [open, setOpen] = React.useState(false);
  const large = true;
  //  if (!online) return <>Loading</>;
  return (
    <BandContainer id="band-container-wt" darktext={dark} open={true} large={true} onClick={() => console.log("CLICK")} >

      <Body id={`blah-body-wt-${online ? 'online' : 'ssr'}`} style={{ width: '100vw', height: '100hw' }}  >
        <CTAButton onClick={() => preview()}>Preview</CTAButton>

        <CanvasBox>
          <canvas id="wt-canvas" ref={setCanvasElRef} width={700} height={600} />
        </CanvasBox>

        <br />
        <CTAButton onClick={async () => setGifImage(await recordWebm(linkid, document.getElementById('wt-canvas') as HTMLCanvasElement, 4))}>Create Webm</CTAButton>
        <CTAButton> <a href={gifImage} >Image Download Link</a></CTAButton>



      </Body>

      {image?.url ? <Image id="hid-image" large={large} open={open} src={image?.url} /> : null}
    </BandContainer>
  );
};
export default GreetingCard;