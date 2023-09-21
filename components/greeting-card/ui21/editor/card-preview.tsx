import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from 'styled-components';
import Box from "@mui/material/Box";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Typography from '@mui/material/Typography';
import ImageData from '../../../../lib/image-data';
import ToolbarUpload from "../../../toolbar-upload";
import ImageStrip from "../../../image-strip";
import EmptyImage from "../../empty-image";
import Card from "../index";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton';
import dynamic from 'next/dynamic';
//import Example from './example';

const Recorder = dynamic(
  () => import('../gif-recorder'),
  { ssr: false }
)

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
const Wrap = styled.div`
  padding-left:3px;
  padding-right:3px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
`;
const ExitButton = styled.div`
    position:absolute;
    top:0px;
    right:0px;
    z-index:1000;
    padding:10px;
    `;
interface Props {
  image: ImageData;
  dark: string;
  open: boolean;
  setOpen: (open: boolean) => void;

  session?: any;
  text: string;
  animatedSignature?: number;
  signature: string;
  creatingCard?: boolean;
  handleCreate: () => void;
  linkid: string;

}

const ImageOverlay: React.FC<Props> = ({ creatingCard = false, handleCreate, linkid, dark, session, open, setOpen, text, signature, animatedSignature, image }) => {
  // /const [open, setOpen] = React.useState(false);
  const [ref, setRef] = useState<any | null>(null);
  const [animate, setAnimate] = useState<boolean>(false);
  const theme = useTheme();
  const fullScreen = true;//useMediaQuery(theme.breakpoints.down('sm'));
  //console.log("ImageOverlay",{images,sharedImages,image,huge,open,setOpen,onImageChange,topEditing,setTopEditing})
  if (!session) session = {};
  //if(!onUpload) onUpload=()=>{};
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log("Preview Dialog: open:", { open, animatedSignature });

  const canvasRef = React.useRef<HTMLDivElement>(null);
  const elementRef =  useRef<HTMLDivElement>(null);
  useEffect(() => {
   // if (canvas.current!=ref) {
      console.log("=>canvas.current", elementRef?.current)
      setRef(elementRef.current||null);
      setAnimate(true);
    //}
  },[]);
  
  console.log("canvas",ref)
  return (
    <div>
      {false && <Button variant="outlined" onClick={handleClickOpen}>
        Open responsive dialog
      </Button>}

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Card Preview"}
        </DialogTitle>
        <DialogContent>
          <Wrap>
          <Recorder div={elementRef.current} />
           <div id="canvas"  style={{width:'100%',height:'100%'}}>{<Card  setPrompt={()=>{}} PlayerToolbar={{}} handleRegenerateText={() => { }} setLoading={() => { }} animatedSignature={animatedSignature} editable={false} onAnimatedSignatureChange={() => { }} onGreetingChange={() => { }} onImageChange={() => { }} onSignatureChange={() => { }} canvasRef={elementRef} popoutRef={canvasRef} delayOpen={true} large={true} signature={signature} fbclid={""} utm_content={""} dark={dark} text={text || ''} image={image} id="preview" />}</div> 
            {animate&&!creatingCard && !linkid && 
          <Button  variant="contained" onClick={() => { handleClose(); handleCreate(); }}>Create a public link</Button>
       }
          </Wrap>
             
          <ExitButton>
            <IconButton color="primary" aria-label="exit dialog" onClick={() => setOpen(false)}>
              <ExitToAppIcon />
            </IconButton>
          </ExitButton>
     
        </DialogContent>
       
      </Dialog>
    </div>
  );
}
export default ImageOverlay;