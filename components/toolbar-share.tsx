import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import { RWebShare } from "react-web-share";
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  align-items: center;
 
  margin-top: 20px;

`;

const ToolbarButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size:48px;
  
`;

const ToolbarText = styled.span`
  font-size: 16px;
  
`;

interface ToolbarProps {
    url:string,
    greeting:string
}

const Toolbar: React.FC<ToolbarProps> = ({
    url,
    greeting
}) => {
    //console.log("Toolbar",hasGreeting)
    return (
        <ToolbarContainer data-id="toolbar-generate">
            <RWebShare
                    data={{
                      text: greeting || '',
                      url,
                      title: 'Wish-Text.Com -  Wish Text Composer',
                    }}
                    onClick={() => {
                      //console.log("shared successfully!");
                     
                    }}
                  >
            <ToolbarButton color="primary" size="large" >
                <IosShareOutlinedIcon />
                <ToolbarText> Share Link</ToolbarText>
            </ToolbarButton>
            </RWebShare>
        </ToolbarContainer>
    );
};

export default Toolbar;
