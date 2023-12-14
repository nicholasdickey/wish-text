
import styled from "styled-components";
import React, { useRef } from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import * as ga from '../../../lib/ga';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ReactMarkdown from "react-markdown";
import LinearProgress from '@mui/material/LinearProgress';
import ImageData from "../../../lib/image-data";
import PopoutCard from "./new-popout-card";
import EmptyImage from "../empty-image";
import useWindowSize from "../../hooks/window-size";
import CardHeadline from "./editor/card-headline";
import CardBody from "./editor/card-body";
import CardSignature from "./editor/card-signature";
import CardImage from "./editor/card-image";
import TextToolbar from "./editor/toolbars/text";
import TextDialog from "../text-dialog";
import { Caveat } from 'next/font/google';
const caveat = Caveat({ subsets: ['latin'] });
interface BodyProps {
  l: number;
  large?: boolean;
}

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
    margin-left:5px;
   // border-radius: 5px;  
    transform: rotateY(180deg);  

   
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
    transition: all 1s ease;
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
    color:#2d2b38;// ${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
   // background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
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
    position:absolute;
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

interface Props {
  dark: string,
  fbclid: string,
  utm_content: string,
  text: string,
  loading?: boolean,
  cardlarge?: boolean,
  image?: ImageData,
  signature: string,
  animatedSignature?: number,
  startOpen?: boolean
  delayOpen?: boolean;
  editable?: boolean;
  onGreetingChange: (greeting: string) => void;
  onImageChange: (image: ImageData) => void;
  onSignatureChange: (signature: string) => void;
  onAnimatedSignatureChange: (animatedSignature: number) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  popoutRef: React.RefObject<HTMLDivElement>;
  session?: any;
  images?: ImageData[];
  sharedImages?: ImageData[];
  onUpload?: (result: any, widget: any) => void;
  id?: string;
  handleRegenerateText?: any;
  setLoading?: any;
  PlayerToolbar?: any;
  setPrompt?: () => void;

}
const GreetingCard: React.FC<Props> = ({ popoutRef, setPrompt = () => { }, PlayerToolbar = null, handleRegenerateText: h2 = () => { }, setLoading = () => { }, id = "view", onAnimatedSignatureChange, animatedSignature = 1, editable = false, onGreetingChange, onImageChange, onSignatureChange, canvasRef, delayOpen = false, startOpen = false, loading = false, cardlarge: startLarge = false, dark, fbclid, utm_content, text, image, signature, session, images, sharedImages, onUpload }) => {

  const [open, setOpen] = React.useState(startOpen);
  const [large, setLarge] = React.useState(startLarge);
  const [hugeLeft, setHugeLeft] = React.useState(false);
  const [hugeRight, setHugeRight] = React.useState(false);
  const [dOpen, setDOpen] = React.useState(delayOpen);
  const [topEditing, setTopEditing] = React.useState(false);
  const [imageEditing, setImageEditing] = React.useState(false);
  const [textDialog, setTextDialog] = React.useState(false);
  const theme = useTheme();
  const router = useRouter();
  const size = useWindowSize();
  const handleCTAClick = () => {
    router.push(`/start?fbclid=${fbclid}&utm_content=${utm_content}`);
  };
   console.log("large=", large, "greeting=", text)
  if (!text)
    text = JSON.stringify({ headline: "", body: "" });
  text = text.replace(/\n\n/g, '\n');
  const structuredText = JSON.parse(text);
  // console.log("structuredText=", structuredText)
  //const tw = text.split('\n');

  const headline = structuredText.headline || "";//tw.length > 1 ? tw[0] : '';
  const body = structuredText.body || "";//tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
  //console.log("debug: greeting-card render", { image, text, headline, body, signature })
  const handleTextClick = () => {

  }
  if (dOpen) {
    setDOpen(false);
    setTimeout(() => setOpen(true), 500);
  }
  const onHeadlineChange = (text: string) => {
    console.log("onHeadlineChange=", text);
    onGreetingChange(JSON.stringify({ headline: text, body: body }));
  }
  const onBodyChange = (text: string) => {
    console.log("onBodyChange=", text);
    onGreetingChange(JSON.stringify({ headline, body: text }));
  }
  const handleRegenerateText = async (session: any) => {
    console.log("handleRegenerateText");
    setLoading(true);
    await h2(session);
    setLoading(false);
    console.log("after h2");
  }
  const openDialog=()=>{
    setTextDialog(true);
  }
  // console.log("open=", open, ";large=", large, "signature:", signature)
  const signatureText = signature ? signature.split('\n').map((m, i) => <SignatureLine id={"wt-signature-line" + i} key={i} l={signature.length} large={large}>{m}</SignatureLine>) : [];
  //console.log("signatureText=", signatureText)
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  //console.log("debug: index greeting-card render",{loading,editable,PlayerToolbar})
  return (
    <BandContainer id="band-container-wt" darktext={dark} open={open} large={large} onClick={() => console.log("CLICK")} >

      <Body id="body-wt-2" style={{ width: '100vw', height: '100hw' }}  >
        <PopoutCard id={id} images={images} sharedImages={sharedImages} hugeLeft={hugeLeft} hugeRight={hugeRight} topEditing={topEditing} setTopEditing={setTopEditing} imageEditing={imageEditing} setImageEditing={setImageEditing} session={session} onUpload={onUpload} onAnimatedSignatureChange={onAnimatedSignatureChange} onGreetingChange={onGreetingChange} onImageChange={onImageChange} onSignatureChange={onSignatureChange} canvasRef={popoutRef} editable={editable} open={hugeLeft || hugeRight} isLeft={hugeLeft} card={{ text, image: image || EmptyImage, signature, animatedSignature }} close={() => { setHugeLeft(false); setHugeRight(false); }} />
        {!loading && editable && <TextDialog session={session} open={textDialog} setOpen={setTextDialog} handleRegenerateText={handleRegenerateText} onGreetingChange={onGreetingChange}/>}
        <Card id="index-card" style={{ width: '100vw', height: '100hw' }} large={large} open={open} dark={dark}  >
          <div style={{ width: '100vw', height: '100hw' }} className={`card__container js-card-opener ${open ? "open" : ""}`}  >
            <div id="index-ref" ref={canvasRef} className={`card ${open ? "open" : ""}`} >
              <div className={`card__panel card__panel--front ${open ? "open" : ""}`}>
                {image?.url && <Image large={large} open={open} src={image?.url} />}
              </div>
              <div className={`card__panel card__panel--inside-left ${open ? "open" : ""}`} onClick={() => {
                console.log("dialog click")
                if (topEditing)
                  return;
                if (mobile && !hugeLeft) {
                  setHugeLeft(true);
                  return;
                }
                else if (!topEditing && editable) {
                  console.log("dialog: opening")
                  setImageEditing(true);
                  setTopEditing(true);
                  return;
                }
                console.log("LEFT CLICK")
                if (size?.width > size?.height && size?.width > 600)
                  setLarge(large);
                else
                  setHugeLeft(!hugeLeft);
              }}>
                {image?.url ? <Image large={large} open={open} src={image?.url} /> : editable && <InvertText className={caveat.className}>
                  <div className={caveat.className}> Click to select.               ......................</div></InvertText>}
              </div>
              <CardImage editable={editable} onUpload={onUpload} session={session} images={images} sharedImages={sharedImages} topEditing={topEditing} setTopEditing={setTopEditing} image={image || EmptyImage} open={imageEditing} setOpen={setImageEditing} onImageChange={onImageChange} huge={hugeLeft} />

              <div className={`card__panel card__panel--inside-right ${open ? "open" : ""}`} onClick={() => {
                if (topEditing)
                  return;
                setTimeout(() => setPrompt(), 10);

                console.log("RIGHT CLICK")
                if (size?.width > size?.height && size?.width > 600)
                  setLarge(large);
                else
                  setHugeRight(!hugeRight);
              }}>
                <Inner >

                  <CardHeadline id={`normal-${id}`} topEditing={topEditing} setTopEditing={setTopEditing} editable={editable && !mobile} onChange={onHeadlineChange} headline={headline} large={large} loading={loading} />
                  {loading && <LinearProgress />}
                  <CardBody id={`normal-${id}`} topEditing={topEditing} setTopEditing={setTopEditing} editable={editable && !mobile} onChange={onBodyChange} body={body} large={large} loading={loading} />
                  {!loading && editable && PlayerToolbar}
                  {!loading && editable && <TextToolbar fresh={false} outside={false} session={session} onGenerateClick={openDialog} />}
                  <CardSignature id={`normal-${id}`} animatedSignature={animatedSignature} onAnimatedSignatureChange={onAnimatedSignatureChange} topEditing={topEditing} setTopEditing={setTopEditing} signature={signature} editable={editable && !mobile} onChange={onSignatureChange} large={large} loading={loading} />
                </Inner>
              </div>
            </div>
            {false && <CTAButton onClick={() => setOpen(!open)}> {`${open ? "Close" : "Open"} Card`}</CTAButton>}
          </div>
        </Card>
      </Body>
    </BandContainer>
  );
};
export default GreetingCard;