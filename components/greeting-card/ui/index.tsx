
import styled from "styled-components";
import React from "react";
import Typography from "@mui/material/Typography";

import { useTheme } from '@mui/material/styles';
import * as ga from '../../../lib/ga';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ReactMarkdown from "react-markdown";
import LinearProgress from '@mui/material/LinearProgress';
import ImageData from "../../../lib/image-data";
import PopoutCard from "./popout-card";
import EmptyImage from "../empty-image";
import useWindowSize from "../../hooks/window-size";
interface BodyProps {
  l: number;
  large?: boolean;
}
const Headline = styled.div<BodyProps>`
  width:100%;
  display:flex;
  justify-content:center;
  font-size: ${({ large }) => large ? 22 : 15}px;
  font-weight: 700;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  text-align: center;
  padding: 2px;
  z-index:100;

  @media (max-width: 600px) {
    font-size:9px;
  }
  @media (min-width: 900px) {
    font-size: 19px;
  }
  &.q-h{
    z-index:100;
    position:relative
  }
`;

const TextBody = styled.div<BodyProps>`
  width:100%;
  display:flex;
  justify-content:center;
  font-size:${({ l, large }) => large ? (l > 600 ? 11 : l > 400 ? 12 : l > 300 ? 13 : l > 200 ? 14 : 16) : (l > 600 ? 5 : l > 400 ? 6 : l > 300 ? 7 : l > 200 ? 9 : 10)}px;
  font-weight: 400;
  line-height: 1.7;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  padding-top:1px;
  //padding-bottom:20px;
  //margin-bottom: 40px;
  @media (min-width:600px) and (max-width: 990px) {
    font-size:${({ l, large }) => large ? (l > 600 ? 9 : l > 400 ? 10 : l > 300 ? 11 : l > 200 ? 12: 13) : (l > 600 ?2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
  }
  @media (max-width: 600px) {
    font-size:${({ l, large }) => large ? (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 7) : (l > 600 ?2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
  }
`;

interface LargeProps {
  large?: boolean,
  open?: boolean,
  dark?: string
}
const Image = styled.img<LargeProps>`
    object-fit: cover;
    max-width: ${({ large }) => large ? 3 * 110 : 240}px;
    max-height: ${({ large }) => large ? 4 * 110 : 320}px;
    width:100%;//${({ large }) => large ? 50 : 45}vw;
    height:100%;// ${({ large }) => large ? 75 : 60}vw;
   // border-radius: 5px;  
    transform: rotateY(180deg);  

   
`;
const Card = styled.div<LargeProps>`
position:relative;
margin-top:0px;
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
    cursor: pointer;
    position: absolute;
    left: 0%;
    top: 50%;
    transform: ${({ open, large }) => `translate(-${open ? large ? 19 : 26 : large ? 65 : 70}%, -50%)`};
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
    max-width: ${({ large }) => large ? 3 * 100 : 240}px;
    max-height: ${({ large }) => large ? 4 * 100 : 320}px;
    width:${({ large }) => large ? 16 * 3 : 45}vw;
    height: ${({ large }) => large ? 16 * 4 : 60}vw;
    transform-style: preserve-3d;
    transform: rotateX(65deg);
    transition: all 1s ease;
   // box-shadow: 0 3px 10px rgb(0 0 0 / 0.8);
    //transform: translate(0%, 0%);
    @media (min-width: 768px) {
        width:${({ large }) => large ? 80 :60}vw;
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
    left: 20%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
   // place-items: center;
    transition: all 1s ease;
    backface-visibility: visible;
    transform-origin: left;
    transform-style: preserve-3D;
    transform: rotate3d(0, 1, 0, 0deg);
  }
  .card__panel--front {
    backface-visibility: hidden;
    background: #6288e6;
    z-index: 1; 
  }
  .open .card__panel--front {
    transform: rotate3d(0, 1, 0, -170deg);   
  }
  .card__panel--inside-left {
    background: #fff;
    z-index: 0;
  }
  .open .card__panel--inside-left {
    transform: rotate3d(0, 1, 0, -170deg);
    box-shadow: 0 3px 10px rgb(${({ dark }) => (dark == 'true') ? '255 255 255' : '0 0 0'} / 0.2);
  }
  .card__panel--inside-right {
    border-left: none;
    background: #fff;
    z-index: -1;
    box-shadow: 0 3px 10px rgb(${({ dark }) => (dark == 'true') ? '255 255 255' : '0 0 0'} / 0.2);
  }
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
    //padding-left:1%;
   // padding-right:4%;
   // padding: 14rem 2rem;
    text-align: center;
    color:#2d2b38;// ${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
   // background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
    //background-image: ${({ background }) => background ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})` : null}; 
  //  background-repeat: repeat;
  //  min-height:300px;
    width:100%;
     height:${({ open, large }) => open ? large ? 200 : 250 : large ? 200 : 120}px;

    @media (min-width: 900px) {
      height:${({ open, large }) => open ? large ? 290 : 250 : large ? 200 : 120}px;

    }
    @media (min-width: 600px) {
      height:${({ open, large }) => open ? large ? 280 : 250 : large ? 200 : 120}px;

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
    position:absolute;
    bottom:0px;
    right:0px;
    width:180px;
    // margin-top: 12rem;
`;
const Inner = styled.div`
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding-bottom:40px;
    padding-left: 20px;
    padding-right: 20px;
    
`;
const SignatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 4px;
`;

const Signature = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    //align-items:flex-begin;
   // padding:4px;
    font-family:cursive;
    color:#63599d;
    -ms-transform: rotate(-10deg); /* IE 9 */
    -webkit-transform: rotate(-10deg); /* Chrome, Safari, Opera */
    -moz-transform: rotate(-10deg); /*Mozilla */
     transform: rotate(-10deg); 
     padding-top:24px;
   //  font-size:6px !important;
     @media (max-width: 769px) {
        padding-top:20px;
        font-size:4px;
    }
    `;

const SignatureLine = styled(Typography)<BodyProps>`
    padding:0px;
    text-align:left;
    //font-size:${({large})=>large?3:9}px !important;
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
    display:flex;
    flex-direction:column;
    justify-content:space-between;
`;

interface BandProps {
  dark: string,
  fbclid: string,
  utm_content: string,
  text: string,
  loading?: boolean,
  large?: boolean,
  image?: ImageData,
  signature: string,
  startOpen?: boolean
  delayOpen?:boolean;
}
const GreetingCard: React.FC<BandProps> = ({ delayOpen=false,startOpen = false, loading = false, large: startLarge = false, dark, fbclid, utm_content, text, image, signature }) => {
  const [open, setOpen] = React.useState(startOpen);
  const [large, setLarge] = React.useState(startLarge);
  const [hugeLeft, setHugeLeft] = React.useState(false);
  const [hugeRight, setHugeRight] = React.useState(false);
  const [dOpen, setDOpen] = React.useState(delayOpen);
  const theme = useTheme();
  const router = useRouter();    
  const size = useWindowSize();
  const handleCTAClick = () => {
    router.push(`/?fbclid=${fbclid}&utm_content=${utm_content}`);
  };
 // console.log("large=", large, "greeting=", text)
  text = text.replace(/\n\n/g, '\n');
  const tw = text.split('\n');
  const headline = tw.length > 1 ? tw[0] : '';
  const body = tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
  const handleTextClick = () => {
  }
  if(dOpen){
    setDOpen(false);
    setTimeout(()=>setOpen(true), 500);
  }
 // console.log("open=", open, ";large=", large, "signature:", signature)
  const signatureText = signature ? signature.split('\n').map((m,i) => <SignatureLine id={"wt-signature-line"+i} key={i} l={signature.length} large={large}>{m}</SignatureLine>) : [];
  //console.log("signatureText=", signatureText)
  return (
    <BandContainer darktext={dark} open={open} large={large} onClick={()=>console.log("CLICK")}>
      <Outer>
        <Body >
          <PopoutCard open={hugeLeft||hugeRight} isLeft={hugeLeft} card={{text,image:image||EmptyImage,signature}} close={()=>{setHugeLeft(false);setHugeRight(false);}} />
          <Card large={large} open={open} dark={dark} >
            <div className={`card__container js-card-opener ${open ? "open" : ""}`}>
              <div className={`card ${open ? "open" : ""}`} >
                <div className={`card__panel card__panel--front ${open ? "open" : ""}`}>
                  {image?.url && <Image large={large} open={open} src={image?.url} />}
                </div>
                <div className={`card__panel card__panel--inside-left ${open ? "open" : ""}`} onClick={() => {
                console.log("LEFT CLICK")
                if(size?.width>size?.height) 
                    setLarge(large); 
                else 
                    setHugeLeft(!hugeLeft);
                }}>
                  {image?.url && <Image large={large} open={open} src={image?.url} />}
                </div>
                <div className={`card__panel card__panel--inside-right ${open ? "open" : ""}`} onClick={() => {
                 console.log("RIGHT CLICK")
               if(size?.width>size?.height) 
                    setLarge(large); 
                else 
                    setHugeRight(!hugeRight);
                }}>
         
                  <Inner><Mark image={"false"} onClick={() => handleTextClick()} >
                    <Headline l={headline.length} large={large} className="q-h">
                      <ReactMarkdown>
                        {loading ? "" : headline.replace('#', '###').replace('####', '##')}
                      </ReactMarkdown>
                    </Headline>

                    {loading && <LinearProgress />}
                    <TextBody large={large} l={text.length} id='wt-output'>
                      <ReactMarkdown>
                        {loading ? "Generating..." : body}
                      </ReactMarkdown>
                    </TextBody>
                    <SignatureContainer>
                      <Signature id="wt-signatrue">
                        {signatureText}
                      </Signature>
                    </SignatureContainer>
                  </Mark></Inner>
                </div>
              </div>
             {false&& <CTAButton onClick={() => setOpen(!open)}> {`${open ? "Close" : "Open"} Card`}</CTAButton>}

            </div>

          </Card>


        </Body>
      </Outer>
    </BandContainer>


  );
};
export default GreetingCard;