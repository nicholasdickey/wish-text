// components/PopoutCard.tsx
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import ImageData from "../../../lib/image-data";
import ReactMarkdown from "react-markdown";
import CardData from "../../../lib/card-data";
import EmptyImage from "../empty-image";
import Slide from '@mui/material/Slide';
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
import Backdrop from '@mui/material/Backdrop';
//@ts-ignore
import SwipeableViews from "react-swipeable-views-react-18-fix";
//import Slider from "react-slick";
import Dialog from '@mui/material/Dialog';
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
    height:110vh;
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
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
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
    @media (min-width: 600px) {
      font-size:${({ l, large }) => (l > 600 ? 24 : l > 400 ? 35 : l > 300 ? 36 : l > 200 ? 37 : 38) }px;
    }
    @media (max-width: 600px) {
      font-size:${({ l, large }) => large ? (l > 600 ? 10 : l > 400 ? 11 : l > 300 ? 12 : l > 200 ? 16 : 18) : (l > 600 ? 14 : l > 400 ? 15 : l > 300 ? 16 : l > 200 ? 17 : 18)}px;
    }
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
     font-size:36px !important;
     @media (min-width: 600px) {
        padding-top:40px;
        font-size:52px;;
    }
    @media (max-width:600px) {
        padding-top:15px;
        font-size:34px;;
    }
    `;

const SignatureLine = styled(Typography) <BodyProps>`
    padding:0px;
    text-align:left;
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
    card: {
        text: string;
        image: ImageData;
        signature: string;    
    };
    open: boolean;
    isLeft:boolean; 
}

const PopoutCard = ({ close, card, open, isLeft }: PopoutCardProps) => {
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
    let { text, image, signature } = card;
    text = text.replace(/\n\n/g, '\n');
    const tw = text.split('\n');
    const headline = tw.length > 1 ? tw[0] : '';
    const body = tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
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
            <Popout onClick={() => close()}>

                <SwipeableViews index={isLeftPage?0:1}>
                    <Left>
                        <Image src={card.image.url} />

                    </Left>
                    <Right >
                        <Inner><Mark image={"false"} >
                            <Headline l={headline.length} large={large} className="q-h">
                                <ReactMarkdown>
                                    {loading ? "" : headline.replace('#', '###').replace('####', '##')}
                                </ReactMarkdown>
                            </Headline>


                            <TextBody large={large} l={text.length} id='wt-output'>
                                <ReactMarkdown>
                                    {loading ? "Generating..." : body}
                                </ReactMarkdown>
                            </TextBody>
                            <SignatureContainer>
                                <Signature>
                                    {signatureText}
                                </Signature>
                            </SignatureContainer>
                        </Mark></Inner>
                    </Right>
                </SwipeableViews>


            </Popout></Dialog>

    );
};

export default PopoutCard;
