import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import useCopyToClipboard from '../../../../../lib/copy-to-clipboard';
import LinearProgress from '@mui/material/LinearProgress';

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
interface Props {
    outside:boolean;
}
const ToolbarText = styled.span<Props>`
  font-size: ${({outside})=>outside?16:10}px;
`;

interface ToolbarProps {
    onGenerateClick: any;
    session: any;
    fresh:boolean;
    outside:boolean;
    loading?: boolean;
}
const Toolbar: React.FC<ToolbarProps> = ({
    onGenerateClick,
    session,
    fresh=false,
    outside=false,
    loading = false
}) => {
     return (<>
     {loading&& <LinearProgress />}
       {!loading&&<ToolbarContainer>
           
            <ToolbarButton color={outside?"primary":"primary"} size={outside?"large":"small"} onClick={async ()=>{await onGenerateClick(session)}}>
                <TextFieldsIcon />
                <ToolbarText outside={outside} >{fresh?"Suggest Wish Text":outside?"Regenerate Wish Text":"Try Another Suggestion"}</ToolbarText>
            </ToolbarButton>         
        </ToolbarContainer>}
        </>
    );
};

export default Toolbar;
