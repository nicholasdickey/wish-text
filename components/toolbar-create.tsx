import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Link from '@mui/material/Link';
const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 100;
  margin-bottom:20px;
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
    url: string;
   
}

const Toolbar: React.FC<ToolbarProps> = ({
    url,
   

}) => {
    return (
        <ToolbarContainer>
            <Link href={url}>
                <ToolbarButton color="primary" size="large">
                    <CardGiftcardIcon />
                    <ToolbarText> Create a Wish Card</ToolbarText>
                </ToolbarButton>
            </Link>
        </ToolbarContainer>
    );
};

export default Toolbar;
