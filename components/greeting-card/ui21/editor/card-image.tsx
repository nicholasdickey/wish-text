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
import { Box, IconButton } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Typography from '@mui/material/Typography';
import ImageData from '../../../../lib/image-data';
import ToolbarUpload from "../../../toolbar-upload";
import ImageStrip from "../../../image-strip";
import EmptyImage from "../../empty-image";
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
interface Props {
  image: ImageData;
  huge?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  onImageChange: (image: ImageData) => void;
  topEditing:boolean;
  setTopEditing:(topEditing:boolean)=>void;
  images?: ImageData[],
  sharedImages?: ImageData[];
  onUpload?: (result:any,widget:any) => void;
  session?:any;
  editable?:boolean;

}

const ImageOverlay: React.FC<Props> = ({editable,session,images,sharedImages,onUpload,image,huge,open,setOpen,onImageChange,topEditing,setTopEditing})=>{
    //const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = false;//useMediaQuery(theme.breakpoints.down('sm'));
    //console.log("ImageOverlay",{images,sharedImages,image,huge,open,setOpen,onImageChange,topEditing,setTopEditing})
    if(!images) images=[];
    if(!sharedImages) sharedImages=[];
    if(!session) session={};
    if(!onUpload) onUpload=()=>{};
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setTopEditing(false);
        setOpen(false);
      };
    console.log("Dialog: open:",open,"topEditing:",topEditing);  
    const stripClickHandler = (image: ImageData | null): void => {
      //if (image?.url)
      //  setPromptImageStrip(true)
      //setTimeout(async () => await recordEvent(sessionid, 'stripClickHandler', image?.url || ''), 1000);
  
      if (image == null) {
        image = EmptyImage;
      }
      console.log("render: setSelectedImage", image);
      // setSelectedImage(image); 
      onImageChange(image);
      
      handleClose();
    }
    return (
        <div>
          {false&&<Button variant="outlined" onClick={handleClickOpen}>
            Open responsive dialog
          </Button>}
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Select Card Image"}
            </DialogTitle>
            <DialogContent>
             
              {editable&&<Box sx={{ mt: 0, width: 1 }}>
            <Typography variant="caption" gutterBottom color="textSecondary"
            >Use stock images or upload your own:</Typography><br /><br />
            <Box sx={{ mt: 1, pr: 0, width: { xs: 1 } }} textAlign="center">
              {(images&&images.length > 0 || sharedImages&&sharedImages.length > 0) && session.greeting && <ImageStrip sharedImages={sharedImages} images={images} onImageClick={stripClickHandler} />}
            </Box>
            <ToolbarUpload onUploadClick={onUpload} hasGreeting={session.greeting ? true : false} />

          </Box>}
             
            </DialogContent>
          
          </Dialog>
        </div>
      );
  }
  export default ImageOverlay;