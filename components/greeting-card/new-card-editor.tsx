import React, { useState, useRef, useEffect, useCallback } from "react";
import { styled } from "styled-components";
import html2canvas from "../html2canvas";
import FileSaver from "file-saver";

//project
import { getSessionCards, addSessionImage, updateSession } from "../../lib/api";
import { Options } from "../../lib/with-session";
import ToolbarUpload from "../toolbar-upload";
import ToolbarShare from "../toolbar-share";
import ImageStrip from "../image-strip";
import ImageData from "../../lib/image-data";
import CardData from "../../lib/card-data";
import Card from "./ui21";
//import Signature from "./card-signature";
import * as ga from '../../lib/ga'
import CardPlayerToolbar from "../toolbar-card-player";
import Section from "./editor-section";
//mui
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { recordEvent, recordSessionCard } from '../../lib/api'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
//third party
import { DefaultCopyField } from '@eisberg-labs/mui-copy-field';
//import { RWebShare } from "react-web-share";
import CardHeadline from "./ui21/editor/card-headline";
import CardPreview from "./ui21/editor/card-preview";
import Hint from "./ui21/hint";
const TooblarPlaceholder = styled.div`
  height: 48px;
`;
const SignatureLabel = styled.div`
  display:flex;
  text-align:left !important;
  justify-content:flex-start;
`;

const CopyField = styled(DefaultCopyField)`
  width:80%;
  margin:10%;
  padding:4px;
`;
const Divider = styled.div`
display:none;
@media (max-width: 768px) {
    display:block;
}
`;
interface WebShareProps {
  color: string;
}
const WebShare = styled.div<WebShareProps>`
    color:${props => props.color};
  `;
export default function CardEditor({
  //num,
  greeting,
  signature,
  animatedSignature,
  linkid,
  image,

  // prompt flags:
  onVirgin2,
  virgin,
  prompt4,
  prompt5,
  prompt6,
  promptImageStrip,
  setPrompt5,
  setPrompt6,
  setPromptImageStrip,

  session,
  updateSession2,

  sharedImages,
  fbclid,
  utm_content,
  darkMode,
  startOpen,
  cardNum,
  cardMax,
  setNumPointer,
  
  //currentCard,
  newCardsStack,
  handleRegenerateText,
  setNewCardsStack,
  setCardNum,
  setCardMax,
  images,
  setImages,
  // authSession
  //-------------------
  //currentGreeting,
  //currentNum,
  // setCurrentGreeting,
  setImage,

  setSignature,
  setAnimatedSignature,
  setLinkid,
  setGreeting,
  //setCurrentNum,
  PlayerToolbar,
  setNum,
  setMax,

}: {


 // num: number;
  image: ImageData;
  greeting: string;
  signature: string;
  animatedSignature:number;
  linkid: string;

  setImage: (image: ImageData) => void;
  setSignature: (signature: string) => void;
  setAnimatedSignature: (animatedSignature: number) => void;
  
  setLinkid: (linkid: string) => void;
  handleRegenerateText:any;
  max: number;
  onVirgin: any;
  onVirgin2: any;
  virgin: boolean;
  virgin2: boolean;
  prompt4: boolean;
  prompt5: boolean;
  prompt6: boolean;
  promptImageStrip: boolean;
  setLoadReady: any;
  session: Options;
  updateSession2: any;

  setPrompt5: any;
  setPrompt6: any;

  sharedImages: ImageData[];
  sessionid: string;
  fbclid: string;
  utm_content: string;
  darkMode: boolean;
  startOpen?: boolean;
 
  cardNum: number;
  cardMax: number;
  setNumPointer: (num: number) => void;

  //currentCard: CardData;
  newCardsStack: CardData[];

  setNewCardsStack: (cardStack: CardData[]) => void;
  setCardNum: (num: number) => void;
  setCardMax: (num: number) => void;
  images: ImageData[];
  setImages: (images: ImageData[]) => void;

  //  authSession: any;
  setPromptImageStrip: (promptImageStrim: boolean) => void;
  setGreeting: (greeting: string) => void;
  PlayerToolbar: any;
  setNum?: (number: number) => void;
  setMax?: (number: number) => void;
}) {

  const [loading, setLoading] = useState<boolean>(false);
  const [prevGreeting, setPrevGreeting] = useState<string>('');
  const [creatingCard, setCreatingCard] = useState<boolean>(false);
 // const [cardGreeting,setCardGreeting]=useState<string>(greeting||"");
  //const [cardAnimatedSignature,setCardAnimatedSignature]=useState<number>(animatedSignature||0);
  const [openCardPreview, setOpenCardPreview] = useState<boolean>(false);
  const sessionid = session.sessionid;

  const theme = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const popoutRef = useRef<HTMLDivElement>(null);
  const [imageData, setImageData] = useState(null as any);
  //console.log("debug: new card editor:",greeting)
  const emptyImage = {
    url: '',
    publicId: '',
    height: 0,
    width: 0,
    thumbnailUrl: '',
    original_filename: ''
  }
  // console.log("RENDER output",greeting,value)
  const convertDivToPng = async (div: any) => {
   // console.log("div=>:", div, div.width, div.height, div.scale, div)
    const canvas = await html2canvas(div, {
      useCORS: true,
      logging: true,
      width: div.width,
      height: div.height,
      scale: window.devicePixelRatio,
    });
    console.log("canvase:", canvas)
    const image = canvas.toDataURL("image/jpeg", 0.3);
    console.log("imageLength:", image.length)
    return image;
  };
  const onGreetingChange = (value: string) => {
    setGreeting(value)
   // updateSession2({ greeting: value });
  }
  const onSignatureChange = (value: string) => {
    setSignature(value);
  }
  const onImageChange = (image: ImageData) => {
    setImage(image);
  }
  const handleChange = (card: CardData) => {
    let { greeting:card_Greeting="",signature: cardSignature, animatedSignature:cardAnimatedSignature, image: cardImage, linkid: cardLinkid, num: card_Num } = card;
    console.log("handleChange1:",{image,cardImage,greeting,card_Greeting,signature,cardSignature, animatedSignature,cardAnimatedSignature, cardLinkid,card_Num});
    
    if(! cardAnimatedSignature)
    cardAnimatedSignature=0;    
    if (!card_Greeting)
      card_Greeting = greeting;
    // if (!num)
    //   num = currentNum;
     if (!cardImage)
      cardImage = image;
     if (!cardSignature)
      cardSignature = signature; 
   // if (card_Num != num)
    //  setNumPointer(card_Num || 0);
    console.log("handleChange2:",{image,cardImage,greeting,signature});
    if(card_Greeting!=greeting)
      setGreeting(card_Greeting); 

    if (cardImage != image)
      setImage(cardImage);
    if (cardSignature != signature)
      setSignature(cardSignature);
    if (cardLinkid != linkid)
      setLinkid(cardLinkid || '');
    if(cardAnimatedSignature!=animatedSignature)
      setAnimatedSignature(cardAnimatedSignature);
    //setCardAnimatedSignature(cardAnimatedSignature);
    const newCardsLength = newCardsStack.length;
    console.log("handleChange111:", newCardsStack, cardNum)
    let cm = cardMax, cn = cardNum;
    let newStack = [...newCardsStack];

    if (!cardLinkid|| cardNum > cardMax - newCardsLength) { //if is one of the new cards
      console.log("handleChange from newCards", newCardsStack, card)
      console.log("111", cardMax, cardNum)
      const newCardsIndex = cardMax - cardNum - 1;
        console.log("222", newCardsStack);

      newStack.splice(newCardsIndex, 1, card);
      console.log("333", newCardsStack, newStack);
      setNewCardsStack(newStack);
    }
    else { // if a card from history
      console.log("handleChange ==> from history", newCardsStack, card)
      cm = cardMax + 1;
      cn = cm;
      setCardMax(cm);
      setCardNum(cn);
      newStack = [...newCardsStack]
      newStack.push(card);
      setNewCardsStack(newStack);
    }
    console.log("****** ====>>>> end of handleChange:",{ greeting:card_Greeting, image: cardImage, signature: cardSignature, animatedSignature:cardAnimatedSignature,linkid: cardLinkid, cardMax: cm, cardNum: cn, hasNewCard: true, newCardsStackString: JSON.stringify(newStack) })
    setTimeout(() => updateSession2({ greeting:card_Greeting, image: cardImage, signature: cardSignature,animatedSignature:cardAnimatedSignature, linkid: cardLinkid, cardMax: cm, cardNum: cn, hasNewCard: true, newCardsStackString: JSON.stringify(newStack) }), 1);
  }
  /**
   * When greeting changes, update the current card
   */
  useEffect(() => {
    if (prevGreeting&&greeting !== prevGreeting) {
      console.log("==> useEffect",greeting,prevGreeting);
      setPrevGreeting(greeting);
      if (prevGreeting != '_') {
       // console.log("useEffect greeting changed", { num })
        let card = {
          greeting,
          image,
          signature,
          animatedSignature,
          linkid: '',
         
        }

        handleChange(card);
      }
    }
  }, [greeting]);

  const processCardRecord = async (record: CardData, cardNum: number) => {
    const {greeting:cardGreeting='', image, signature,animatedSignature=1, num, linkid } = record;

    console.log("processCardRecord", { cardNum, record })
    setCardNum(cardNum);
    setPrevGreeting("_");
   // setNumPointer(num || 0);
    setGreeting(cardGreeting);
    setSignature(signature);
    setAnimatedSignature(animatedSignature);
    setImage(image);
    setLinkid(linkid || '');
    updateSession2({ image, signature, linkid, cardNum });
  }


  const OutputPlayerToolbar = <>{cardMax > 1 ? <CardPlayerToolbar
    num={cardNum}
    max={cardMax}
    onPrevClick={async () => {
      console.log("onPrevClick2=>", newCardsStack, cardNum, cardMax)
      if (cardNum > 1) {
        const newCardsStackLength = newCardsStack.length;
        console.log("onPrevClick3=>", cardNum, cardMax, newCardsStackLength)
        if (cardNum - 1 > cardMax - newCardsStackLength) {
          const nextCardIndex = cardNum - (cardMax - newCardsStackLength) - 1 - 1;
          // const nextCardIndex = nextCard- 1;
          console.log("onPrevClick4=>", cardNum, cardMax, newCardsStackLength, nextCardIndex)
          const card = newCardsStack[nextCardIndex];
          console.log("onPrevClick5=>", card, cardNum - 1, newCardsStack)
          await processCardRecord(card, cardNum - 1);
        }
        else {
          const { success, record } = await getSessionCards(session.sessionid, cardNum - 1);
          console.log("onPrevClick222s", success, record)
          if (success) {
            await processCardRecord(record, cardNum - 1);
          }
        }
      }
    }}
    onNextClick={async () => {
      const newCardsStackLength = newCardsStack.length;
      console.log("onNextClick2=>", newCardsStack, cardNum, cardMax)
      if (cardNum + 1 <= cardMax - newCardsStackLength) {
        console.log("call getSessionCards=>", cardNum + 1)
        const { success, record } = await getSessionCards(session.sessionid, cardNum + 1);
        console.log("onNextClick2", success, record)
        if (success) {
          await processCardRecord(record, cardNum + 1);
        }
      }
      else {
        const nextCardIndex = cardNum - (cardMax - newCardsStackLength) - 1 + 1;
        console.log("onNextClick3=>", cardNum, cardMax, newCardsStackLength, nextCardIndex)
        const card = newCardsStack[nextCardIndex];
        await processCardRecord(card, cardNum + 1);
      }
    }}

    onFirstClick={async () => {
      const newCardsStackLength = newCardsStack.length;
      if (cardMax - newCardsStackLength >= 1) {
        const { success, record } = await getSessionCards(session.sessionid, 1);
        console.log("onFirstClick2", success, record)
        if (success) {
          await processCardRecord(record, 1);
        }
      }
      else { // not reachable
        const card = newCardsStack[newCardsStackLength - 1];
        await processCardRecord(card, 1);
      }
    }}
    onLastClick={async () => {
      const newCardsStackLength = newCardsStack.length;
      console.log("onLastClick2", newCardsStack)
      if (newCardsStackLength == 0) {
        const { success, record } = await getSessionCards(session.sessionid, cardMax);
        console.log("onNextClick2", success, record)
        if (success) {
          await processCardRecord(record, cardMax);
        }
      }
      else {
        const card = newCardsStack[0];
        await processCardRecord(card, cardMax);
      }
    }}
  /> : <TooblarPlaceholder />}</>


  const stripClickHandler = (image: ImageData | null): void => {
    if (image?.url)
      setPromptImageStrip(true)
    setTimeout(async () => await recordEvent(sessionid, 'stripClickHandler', image?.url || ''), 1000);

    if (image == null) {
      image = emptyImage
    }
    console.log("render: setSelectedImage", image);
    // setSelectedImage(image); 
    handleChange({
      image,
      signature,
      greeting,
      linkid: ''
    });
  }

  useEffect(() => {
    console.log("useEffect", greeting)
    if (!greeting) {
      console.log("useEffect no greeting")
      stripClickHandler(null);
      const image = {
        url: '',
        publicId: '',
        height: 0,
        width: 0,
        thumbnailUrl: '',
        original_filename: ''
      }
      handleChange({
        greeting: '',
        image: image,
        signature: '',
        linkid: ''
      })
    }
  }, [greeting]);

  const onTextEditorClick = () => {
    setTimeout(async () => await recordEvent(session.sessionid, 'clickOnTextEditor', ''), 1000);
    setPrompt5(true);
    updateSession2({ prompt5: true});
  }
  const handlePreview = () => {
    setOpenCardPreview(true);
  }
  const handleCreate: () => void = async () => {
    console.log("handleCreate:", { image, signature, animatedSignature, greeting })
    setCreatingCard(true);
    // setTimeout(async () => await recordEvent(session.sessionid, 'create-card', ''), 1000);
    //await handleDownload();
    //const metaimage = await captureImage();
    let card: CardData = {
   
      image,
      signature,
      animatedSignature,
      greeting,
      metaimage:''
    }

    const { success, linkid, cardNum } = await recordSessionCard(sessionid, card);

    setTimeout(async () => await recordEvent(session.sessionid, 'create-card', linkid), 1000);
    setCreatingCard(false);
    setLinkid(linkid);
    setNewCardsStack([]);
    // card.linkid = linkid;
    console.log("handleCreate2:", { image,signature,animatedSignature,greeting,success, linkid, cardNum,card })
    if (success) {

      setCardNum(cardNum);
      setCardMax(cardNum);
      updateSession2({ linkid, hasNewCard: false, newCardStackString: '', cardNum, cardMax: cardNum });
      console.log("handleCreate after updateSession2",image)
    }

  }
  const captureImage = async () => {
    const data = await convertDivToPng(canvasRef.current);
    setImageData(data);
    return data;
  }
  const handleDownload = async () => {
    try {
      console.log("callig convertDivToPng", canvasRef.current)
      const data = await convertDivToPng(canvasRef.current);
      setImageData(data);
      console.log(
        "handleDownload:", canvasRef.current, data
      )
      var randomstring = () => Math.random().toString(8).substring(2, 7) + Math.random().toString(8).substring(2, 7);

      const filename = `${randomstring()}-wt2.png`;

      setTimeout(async () => await recordEvent(session.sessionid, ' card meta download', ''), 1000);

      if (window.saveAs) {
        window.saveAs(data, 'a' + filename);
      } else {
        FileSaver.saveAs(data, filename);
      }
    } catch (e) {
      console.log(e);
    }
  };
  console.log("====> render greeting-card", { greeting, cardNum, cardMax,image,linkid })


  const onUpload = (result: any, widget: any) => {
    const { secure_url: url, public_id: publicId, height, width, thumbnail_url: thumbnailUrl, original_filename: originalFilename } = result.info;
    onVirgin2();
    ga.event({
      action: "upload",
      params: {
        sessionid: session.sessionid,
        url: url,
        original_filename: originalFilename,
      }
    })
    setTimeout(async () => await recordEvent(session.sessionid, 'upload', `${originalFilename};${url}`), 1000);

    const newImage: ImageData = {
      url,
      publicId,
      height,
      width,
      thumbnailUrl,
      original_filename: originalFilename,
    };

    setImages([...images, newImage]);
    //setSelectedImage(newImage);
    setTimeout(async () => {
      const newImagesData = await addSessionImage(session.sessionid, newImage);
      // if(newImagesData.success)
      // setImages(newImages.);)  
    }, 1);

    handleChange({
      greeting,
      image: newImage,
      signature,
      linkid: ''
    })
  };


  console.log("RENDER========>");
  ;

  return (
    <>
      <div>
        {greeting && OutputPlayerToolbar}
      </div>
      
     {false&&<Box sx={{ mt: 10 }}>
        <Section darkMode={darkMode}>

          <Box sx={{ mt: 0, width: 1 }}>
            <Typography variant="caption" gutterBottom color="textSecondary"
            >Use stock images or upload your own:</Typography><br /><br />
            <Box sx={{ mt: 1, pr: 0, width: { xs: 1 } }} textAlign="center">
              {(images.length > 0 || sharedImages.length > 0) && session.greeting && <ImageStrip sharedImages={sharedImages} images={images} onImageClick={stripClickHandler} />}
            </Box>
            <ToolbarUpload onUploadClick={onUpload} hasGreeting={session.greeting ? true : false} />

          </Box>

        </Section>
      </Box>}

      <Card
        session={session}
        images={images}
        sharedImages={sharedImages}
        onUpload={onUpload}
        canvasRef={canvasRef}
        popoutRef={popoutRef}
        image={image}
        text={greeting}
        signature={signature}
        animatedSignature={animatedSignature}
        fbclid={fbclid}
        utm_content={utm_content}
        dark={darkMode ? "true" : "false"}
        startOpen={true} 
        cardlarge={true}
        editable={true}
        onGreetingChange={(value: string) => {handleChange({ greeting: value, image, signature, animatedSignature,linkid: '' }) }}
        onImageChange={(image: ImageData) => { handleChange({ greeting, image, signature, animatedSignature,linkid: '' }) }}
        onSignatureChange={(value: string) => { handleChange({ greeting, image, signature: value,animatedSignature, linkid: '' }) }}
        onAnimatedSignatureChange={(value: number) => { handleChange({ greeting, image, signature, animatedSignature: value, linkid: '' }) }}
        handleRegenerateText={handleRegenerateText}
        loading={loading}
        setLoading={setLoading}
        PlayerToolbar={PlayerToolbar}
        setPrompt={onTextEditorClick}
     />

      {linkid && <CopyField
        label="Share Card Link"
        value={`${process.env.NEXT_PUBLIC_SERVER}/card/${linkid}`} />}
      {false && linkid && <img width={600} height={'auto'} src={imageData} />}
      {!prompt5&& <Box sx={{pb:4}}><Hint message="Click on any area to edit..." prompt={prompt5} setPrompt={setPrompt5} loading={loading}/></Box>}
      
      {!creatingCard && !linkid && <Box sx={{ mt: 1, width: 1 }}>

        <Button fullWidth variant="contained" onClick={handlePreview}>Preview Card</Button>

      </Box>
      }
      {!creatingCard && !linkid && <Box sx={{ mt: 1, width: 1 }}>

        <Button fullWidth variant="contained" onClick={handleCreate}>Create a public link</Button>

      </Box>
      }
      {openCardPreview&&<CardPreview  creatingCard={creatingCard} linkid={linkid} handleCreate={handleCreate} dark={darkMode ? "true" : "false"} open={openCardPreview} setOpen={setOpenCardPreview} text={greeting} signature={signature} animatedSignature={animatedSignature} image={image} />}
      {creatingCard && <LinearProgress />}
      {!creatingCard && linkid && <ToolbarShare greeting={greeting} url={`${process.env.NEXT_PUBLIC_SERVER}/card/${linkid}`} />}
    </>
  );
}
/**
 * 
 * 
 *  {!promptImageStrip && virgin && !loading ? <Box sx={{ mt: 0, width: 1 }}>
            <Starter onClick={() => setPrompt6(true)}><ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage>
                <Typography fontSize="inherit" color="secondary">Use stock images or upload your own:</Typography></StarterMessage></Starter></Box> : null}

        
 */
