import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CancelIcon from '@mui/icons-material/Cancel';
import * as ga from '../lib/ga';
const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ToolbarButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToolbarText = styled.span`
  font-size: 16px;
`;

interface ToolbarProps {
  
  onUpdateClick: () => void;
  onCancelClick: () => void;
  
}

const Toolbar: React.FC<ToolbarProps> = ({
  onUpdateClick,
  onCancelClick
}) => {

 
  return (
    <ToolbarContainer>
      <ToolbarButton   color={"info"} size="large" onClick={onCancelClick}>
        <CancelIcon />
        <ToolbarText> Cancel</ToolbarText>
      </ToolbarButton>
      <ToolbarButton   color={"success"} size="large" onClick={onUpdateClick}>
        <TextFieldsIcon />
        <ToolbarText> Update Message</ToolbarText>
      </ToolbarButton>
      
    </ToolbarContainer>
  );
};

export default Toolbar;
