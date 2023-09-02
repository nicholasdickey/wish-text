import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import FormControlLabel from '@mui/material/FormControlLabel';

interface BodyProps {
    l: number;
    large: boolean;
}

const TextBody = styled.div<BodyProps>`
    width:100%;
    font-size:${({ l, large }) => large ? (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 7) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
    font-weight: 400;
    padding:2px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height:1.7;
    @media (min-width:600px) {
        font-size:${({ l, large }) => large ? (l > 600 ? 9 : l > 400 ? 10 : l > 300 ? 11 : l > 200 ? 12 : 13) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
    } 
`;

const Wrap = styled.div`
    position:relative;
    width:100%;
    margin-top:12px;
`;
interface EditableProps{
    editable:boolean;
}
const StyledTextareaAutosize = styled(TextareaAutosize)`   
   &:focus-visible {
      outline: 0;
    }
    background:inherit;
    color: inherit;
    overflow:auto;
    min-width:100%;
    height:100%;
    border:none;
`;

interface WidthProps {
    divwidth: number;
    l: number;
    large: boolean;
    topEditing: boolean;
    editable:boolean
}

const Editor = styled.div<WidthProps>`
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
    padding:2px;
    margin-right:0px;
  

    cursor: ${({ editable }) => editable ? 'text' : 'default'};

    .MuiFormControlLabel-root{
        width:${({ divwidth }) => divwidth ? (divwidth - 12) + 'px' : '100%'};
    }
    & textarea{
        resize: none;
        width:${({ divwidth }) => divwidth ? (divwidth - 82) + 'px' : '100%'};
        max-width:${({ divwidth }) => divwidth ? (divwidth - 82) + 'px' : '100%'};
       // min-width:${({ divwidth }) => divwidth ? divwidth + 'px' : '100%'};
        text-align:left;
        font-family:Caveat;
        font-size:11px;
        line-height:1.7;
        text-align:center;
        font-size:${({ l, large }) => large ? (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 7) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
        font-weight: 400;
        @media (min-width:600px) {
            font-size:${({ l, large }) => large ? ( l > 200 ? 12 : 28) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
        }
    }
`;

const EditorBox = styled.div`
  padding-top:15px;
  position:relative;
  text-align:center;
 
  cursor: text;

  & textarea{
    overflow:auto;
    //background:#ffe;
    resize: none;
  }
  
  padding-left:0px;
  padding-right:0px;

`;
const SignatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 4px;
    padding-right:4px;
`;

const Signature = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    //align-items:flex-begin;
   // padding:4px;
    font-family:Caveat;
    color:#63599d;
    -ms-transform: rotate(-10deg); /* IE 9 */
    -webkit-transform: rotate(-10deg); /* Chrome, Safari, Opera */
    -moz-transform: rotate(-10deg); /*Mozilla */
     transform: rotate(-10deg); 
     padding-top:24px;
   //  font-size:6px !important;
     @media (max-width: 769px) {
        padding-top:20px;
        font-size:4px;
    }
    `;

const SignatureLine = styled(Typography) <BodyProps>`
    padding:0px;
    text-align:left;
    font-family:Caveat;
    font-size:28px;
    //font-size:${({ large }) => large ? 3 : 9}px !important;
    @media (max-width: 769px) {    
       font-size:11px;
    }
`;
function useAsyncReference(value:string, isProp = false) {
    const ref = useRef(value);
    const [, forceRender] = useState(false);
  
    function updateState(newState:string) {
      if (!Object.is(ref.current, newState)) {
        ref.current = newState;
        forceRender(s => !s);
      }
    }
  
    if (isProp) {
      ref.current = value;
      return ref;
    }
  
    return [ref, updateState];
  }
interface Props {
    signature: string;
    large: boolean;
    loading: boolean;
    editable: boolean;
    onChange: (headline: string) => void;
    topEditing: boolean;
    setTopEditing: (editing: boolean) => void;
}

const SignatureEditor: React.FC<Props> = ({ topEditing, setTopEditing, editable, signature, large, loading, onChange }) => {
    const [editing, setEditing] = useState(editable);
    //@ts-ignore
    const [text, setText] = useAsyncReference(signature);
    const [divwidth, setDivWidth] = useState(0);
    const theme = useTheme();
    console.log("signature editor render", text.current)
    let ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
               // if(editing)
                  //  setEditing(false);
                //if(topEditing)
                   // setTopEditing(false);
              
                console.log("OUTSIDE CLICK - SIGNATURE",text.current)
                if(text.current!=signature)
                    onChange(text.current);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setEditing]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(event.target.value);
        console.log("click setText:", event.target.value)
    };

    useEffect(() => {
        const div = ref?.current;
        console.log("width-div", div);
        const width = div?.clientWidth || 0;// ? div.clientWidth > 500 ? div.clientWidth : 552 : 552;
        setDivWidth(width + 10 - 4);
        console.log("set width:", width);
    }, [ref.current]);

    const signatureText = text?.current ? text.current.split('\n').map((m: any, i: number) => <SignatureLine id={"wt-signature-line" + i} key={i} l={signature.length} large={large}>{m}</SignatureLine>) : null;
    
    return (
        <Editor editable={editable} topEditing={topEditing} divwidth={divwidth} ref={ref} l={text.current.length || 0} large={large || false}>
            {!editing && <Wrap onClick={() => { console.log("CLICK - signature"); if (editable) { setEditing(true); setTopEditing(true); } }}>
                <SignatureContainer>
                    <Signature id="wt-signatrue">
                        {signatureText?signatureText:'Click to add the "handwritten" signature.'}
                    </Signature>
                </SignatureContainer>
            </Wrap>}

            {editing && <EditorBox >
                <SignatureContainer>
                    <Signature>
                    <FormControlLabel
                        disabled={!editable}
                        sx={{ m: 0, p: 0 }}
                        labelPlacement="top"
                        label={<Typography style={{ color: theme.palette.text.secondary }}></Typography>}
                        control={
                            <StyledTextareaAutosize
                                disabled={!editable}
                                aria-label="signature editor"
                                minRows={2}
                                autoFocus={true}
                                placeholder=""
                                onChange={handleChange}
                                defaultValue={text.current}
                            />
                        }
                    />
                    </Signature>
                </SignatureContainer>
            </EditorBox>}
        </Editor>
    )
}
export default SignatureEditor;