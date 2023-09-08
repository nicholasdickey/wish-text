
import React, { useState } from "react";
import { styled } from "styled-components";
import { useTheme } from '@mui/material/styles';

//project
import ImageData from "../../lib/image-data";
import CardData from "../../lib/card-data";
import { recordEvent, addSessionImage } from '../../lib/api'
import CardControl from './ui21';

import Box from "@mui/material/Box";

const OuterWrapper = styled.div`
    margin-top:60px;
    margin-bottom:120px;
    `;
/**
 * An editable greeting card. Note that num and greeting are tightly correlated. Num refers to index in session history.
 * @param card:CardData 
 */


/********************************************************************************/
interface CardProps extends CardData {
    handleChange: (card: CardData) => void;
    handleCreate: () => void;
    fbclid: string;
    utm_content: string;
    sessionid: string;
    darkMode: boolean;
    canvasRef: React.RefObject<HTMLDivElement>;
}
/********************************************************************************/
const Card: React.FC<CardProps> = ({
    linkid,
    signature,
    greeting,
    image,
    num,
    handleChange, handleCreate,
    fbclid,utm_content,darkMode,
    sessionid,  
    canvasRef 
}) => {
    const theme = useTheme();

    return <OuterWrapper>
        
        <Box sx={{ mt: 14, mb: 2 }} textAlign="center">         
            <CardControl 
            
            onGreetingChange={()=>{}} onImageChange={()=>{}} onSignatureChange={()=>{}} 
            canvasRef={canvasRef} startOpen={true} large={true} 
            fbclid={fbclid} utm_content={utm_content} 
            dark={darkMode ? "true" : "false"} text={greeting || ""} 
            image={image} signature={signature} />
        </Box>
    </OuterWrapper>
}
export default Card;