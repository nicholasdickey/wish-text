// components/PopoutCard.tsx
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import ImageData from "../../../lib/image-data";
import ReactMarkdown from "react-markdown";
import CardData from "../../../lib/card-data";
import LinearProgress from '@mui/material/LinearProgress';
import EmptyImage from "../empty-image";
import Slide from '@mui/material/Slide';
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
import Backdrop from '@mui/material/Backdrop';
//@ts-ignore
import SwipeableViews from "react-swipeable-views-react-18-fix";
import CardHeadline from "./editor/card-headline";
import CardBody from "./editor/card-body";
import CardSignature from "./editor/card-signature";
import CardImage from "./editor/card-image";
//import Slider from "react-slick";
import Dialog from '@mui/material/Dialog';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton';
const Popout = styled.div`
    position:fixed;
    top:0px; 
    left:0px;    
    width:100%;
    height:100%;
   // background:inherit;
    //overflow-y:hidden;
   
    transition: all 1s ease;

`;

const Left = styled.div`
//background:red;
height:100%;
width:100%;
display:flex;
flex-direction:column;
justify-content:center;

//max-width: ${3 * 310}px;
//max-height: ${4 * 310}px;
`
const Right = styled.div`
background:#eee;
color:#111;
height:100%;
width:100%;
flex-direction:column;
justify-content:center;
//max-width: ${3 * 310}px;
//max-height: ${4 * 310}px;
//min-height:100%;
`;
const Image = styled.img`
    object-fit: cover;
   // max-width: ${3 * 310}px;
   // max-height: ${4 * 310}px;
    width:100%;
    height:130vh;
    //z-index:101;
   // border-radius: 5px;  
   // transform: rotateY(180deg);  

   
`;
interface BodyProps {
    l: number;
    large?: boolean;
}
const Headline = styled.div<BodyProps>`
    width:100%;
    display:flex;
    justify-content:center;
   // font-size: ${({ large }) => large ? 18 : 15}px;
    font-weight: 700;
    //font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    text-align: center;
    padding: 0px;
    z-index:100;
  
    @media (min-width: 600px) {
      font-size: 44px;
      padding: 69px !important;
    }
    @media (max-width: 600px) {
      font-size: 22px !important;
    }
    &.q-h{
      z-index:100;
      position:relative
    }
  `;

const Inner = styled.div`
    height:100vh;
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding-bottom:40px;
    padding-left: 20px;
    padding-right: 20px;
    `;

const SignatureLine = styled(Typography) <BodyProps>`
    padding:0px;
    text-align:left;
    font-family:Caveat;
    font-size:28px;
     font-size:${({ large }) => large ? 26 : 9}px !important;
     @media (min-width: 600px) {
      //  padding-top:40px;
        font-size:62px !important;
    }
    `;
interface MarkProps {
    image: string;
}
const Mark = styled.div<MarkProps>`
    height:100vh;
   // position: ${({ image }) => image == "true" ? 'absolute' : 'relative'};
    //bottom:0;
    padding-left:10px;
    padding-right:10px;
    padding-bottom:120px;
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    
`;


interface PopoutCardProps {
    close: () => void;
    session?:any;
    card: {
        text: string;
        image: ImageData;
        signature: string;   
        animatedSignature?:number, 
    };
    open: boolean;
    isLeft:boolean; 
    editable?: boolean;
    onGreetingChange: (greeting: string) => void;
    onImageChange: (image: ImageData) => void;
    onSignatureChange: (signature: string) => void;
    onAnimatedSignatureChange: (animatedSignature: number) => void;
    canvasRef: React.RefObject<HTMLDivElement>;
    topEditing: boolean;
    setTopEditing: (topEditing: boolean) => void;
    imageEditing: boolean;
    setImageEditing: (imageEditing: boolean) => void;
    images?:ImageData[];
    sharedImages?:ImageData[];
    onUpload?: (result:any,widget:any) => void;
    hugeLeft?:boolean;
    hugeRight?:boolean;
    id:string;
}
const ExitButton = styled.div`
    position:absolute;
    top:0px;
    right:0px;
    z-index:1000;
    padding:10px;
    `;
const PopoutCard = ({id,hugeLeft,hugeRight,topEditing,setTopEditing,imageEditing,setImageEditing,session, close, card, open, isLeft,onUpload,images,sharedImages,onAnimatedSignatureChange,editable = false, onGreetingChange, onImageChange, onSignatureChange, canvasRef }: PopoutCardProps) => {
    const [isLeftPage, setIsLeftPage] = useState(isLeft);
   // console.log("=====>isLeftPage", isLeft)
    const settings = {
        // dots: true,
        //infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // ignoreNativeScroll: true,
    };
    const large = true;
    const loading = false;
    console.log("PopoutCard",{editable,card},isLeftPage,isLeft);
    const handleTextClick = () => {
    }
    const onHeadlineChange = (text: string) => {
        console.log("onHeadlineChange=", text);
        onGreetingChange(JSON.stringify({ headline: text, body: body }));
      }
      const onBodyChange = (text: string) => {
        console.log("onBodyChange=", text);
        onGreetingChange(JSON.stringify({ headline, body: text }));
      }
    let { text, image, signature,animatedSignature } = card;
    text = text.replace(/\n\n/g, '\n');
    const tw = text.split('\n');
   // const headline = tw.length > 1 ? tw[0] : '';
    //const body = tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
    const structuredText=JSON.parse(text);
  console.log("==4structuredText=",structuredText)
  //const tw = text.split('\n');
  const headline = structuredText.headline;//tw.length > 1 ? tw[0] : '';
  const body = structuredText.body;//tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
  
    const signatureText = signature ? signature.split('\n').map((m, i) => <SignatureLine key={i} l={signature.length} large={large}>{m}</SignatureLine>) : [];
    useEffect(() => {
        if (isLeft != isLeftPage)
            setIsLeftPage(isLeft)
    }, [isLeft])
  //  console.log("isLeft!!!!!!!!!!!!!!!!")
    /* const handlers = useSwipeable({
         onSwipedLeft: (eventData) => {
             console.log("User Swiped Left!", eventData);
             setIsLeftPage(true)
         },
         onSwipedRight: (eventData) => {
             console.log("User Swiped Right!", eventData);
             setIsLeftPage(false)
         },
     });*/
    return (
        <Dialog fullScreen open={open} >
            <Popout /*onClick={() => close()}*/>
            <ExitButton>
            <IconButton color="primary" aria-label="exit dialog" onClick={()=>close()}>
                <ExitToAppIcon />
            </IconButton>
            </ExitButton>
                <SwipeableViews index={isLeftPage?0:1}>
                    <Left>
                        {!imageEditing&&<Image src={card.image.url} />}
                        
                        <CardImage editable={editable} onUpload={onUpload} session={session} images={images} sharedImages={sharedImages} topEditing={topEditing} setTopEditing={setTopEditing} image={image||EmptyImage} open={imageEditing} setOpen={setImageEditing} onImageChange={onImageChange} huge={hugeLeft}  />
            

                    </Left>
                    <Right >
                    <Inner>
                        <CardHeadline id={`popout-${id}`} topEditing={topEditing} setTopEditing={setTopEditing} editable={editable} onChange={onHeadlineChange} headline={headline} large={large} loading={loading} />
                        {loading && <LinearProgress />}
                        <CardBody id={`popout-${id}`} topEditing={topEditing} setTopEditing={setTopEditing} editable={editable} onChange={onBodyChange} body={body} large={large} loading={loading} />
                        <CardSignature id={`popout-${id}`} animatedSignature={animatedSignature||0} onAnimatedSignatureChange={onAnimatedSignatureChange} topEditing={topEditing} setTopEditing={setTopEditing} signature={signature} editable={editable} onChange={onSignatureChange} large={large} loading={loading} />
                    </Inner>
                     
                    </Right>
                </SwipeableViews>


            </Popout></Dialog>

    );
};

export default PopoutCard;
