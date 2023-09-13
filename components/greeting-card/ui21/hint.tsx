import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from 'styled-components';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

const Starter = styled.div`
  display:flex;
  justify-content:flex-start;
  font-size:36px;
  align-items:center;

  
  `;
const StarterMessage = styled.div`
  font-size:14px;
  padding-left:10px;
  padding-right:10px;
  `;

interface Props {
    prompt: boolean;
    loading?: boolean;
    message:string;
    setPrompt: (prompt: boolean) => void;
}
const Hint: React.FC<Props> = ({  prompt, loading=false, message,setPrompt }) => {
  return (
      <>
          {!prompt && !loading ? <Box sx={{ mt: 1, mb: 1, width: 1 }}>
              <Starter onClick={() => setPrompt(true)}><ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
                  <StarterMessage><Typography fontSize="inherit" color="secondary"/*color="#ffee58"*/>{message}</Typography></StarterMessage></Starter></Box> : null}
      </>
      )
}
export default Hint;