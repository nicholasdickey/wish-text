import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import VaraText from './vara-text';
import Box from '@mui/material/Box';
import { Josefin_Sans } from 'next/font/google'
import { Caveat } from 'next/font/google';
const josefin = Josefin_Sans({ subsets: ['latin'] })
const dancingScript = Caveat({ subsets: ['latin'] });
interface BodyProps {
    l: number;
    large: boolean;
}
const VaraWrap=styled.div<BodyProps>`
    width:100%;
`;
const Wrap = styled.div`
    position:relative;
    width:100%;
    margin-top:12px;
`;
interface EditableProps {
    editable: boolean;
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
    editable: boolean;
}

const Editor = styled.div<WidthProps>`
   // height:100%;
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
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
       // font-size:10px;
        line-height:1.2;
        text-align:center;
       
        font-size:${({ l, large }) => large ? (l > 600 ? 12 : l > 400 ? 13 : l > 300 ? 24 : l > 200 ? 25 : 27) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 14 : l > 200 ? 15 : 16)}px;
        font-weight: 400;
        @media (min-width:600px) {
            font-size:${({ l, large }) => large ? (l > 200 ? 12 : 28) : (l > 600 ? 12 : l > 400 ? 16 : l > 300 ? 20 : l > 200 ? 24 : 28)}px;
        }
    }
    min-height:${({editable,large})=>large?editable?90:300:80}px;
    font-size:${({ l, large }) => large ? (l > 200 ? 12 : 28) : (l > 600 ? 12 : l > 400 ? 16 : l > 300 ? 20 : l > 200 ? 24 : 28)}px;
   
    @media (min-width:600px) {
        font-size:${({ l, large }) => large ? (l > 200 ? 12 : 28) : (l > 600 ? 12 : l > 400 ? 16 : l > 300 ? 20 : l > 200 ? 24 : 28)}px;
   
      // min-height:${(large)=>large?120:0}px;
    }
`;

const EditorBox = styled.div`
  //padding-top:15px;
 // height:100%;
  position:relative;
  text-align:center;
 
  cursor: text;

  & textarea{
    overflow:auto;
   
  }
  
  padding-left:0px;
  padding-right:0px;

`;
const SignatureContainer = styled.div`
    //display: flex;
    //flex-direction: column;
    //justify-content: center;
    //align-items: center;
    //padding-left: 4px;
    padding-right:4px;
    & .outer{
      //  margin-top:10px !important;
    }
`;

const Signature = styled.div`
   // display:flex;
   // flex-direction:column;
   // justify-content:center;
    //align-items:flex-begin;
    text-align:flex-end;
    //padding:4px;
    width:100%;
    font-family:Caveat;
    //font-family:Shadows
    color:#63599d;
    -ms-transform: rotate(-10deg); /* IE 9 */
    -webkit-transform: rotate(-10deg); /* Chrome, Safari, Opera */
    -moz-transform: rotate(-10deg); /*Mozilla */
     transform: rotate(-10deg); 
    // padding-top:24px;
   //  font-size:6px !important;
     @media (max-width: 769px) {
       //padding-top:20px;
        font-size:24px;
    }
    `;
const BottomWrap = styled.div`
    display:flex;
   // height:100%;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    `;
const AnimatedSignature = styled.div`
//position:absolute;
//height:100%;
//bottom:0px;
//right:20px;
   // margin:-10px;
    padding-right:20px;
    display:flex;
    justify-content: flex-end;
    width:100%;
    font-size:8px;
    & .MuiFormControlLabel-label{
        font-size:10px !important;
    }
    `;

const SignatureLine = styled(Typography) <BodyProps>`
    padding-left:0px;

    margin-top:0px;
    line-height:1.2;
    text-align:center;
    font-family:Caveat;
    //font-size:26px;
    //font-size:${({ large }) => large ? 3 : 9}px !important;
    font-size:${({ l, large }) => large ? (l > 200 ? 12 : 28) : (l > 600 ? 10 : l > 400 ? 12 : l > 300 ? 14 : l > 200 ? 16 : 22)}px;
   
    @media (max-width: 600px) {    
        font-size:${({ l, large }) => large ? (l > 200 ? 12 : 28) : (l > 600 ? 10 : l > 400 ? 12 : l > 300 ? 14 : l > 200 ? 16 : 18)}px;
   
    }
`;
function useAsyncReference(value: string, isProp = false) {
    const ref = useRef(value);
    const [, forceRender] = useState(false);

    function updateState(newState: string) {
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
    animatedSignature: number;
    onAnimatedSignatureChange: (animatedSignature: number) => void;
    id: string;

}

const SignatureEditor: React.FC<Props> = ({ onAnimatedSignatureChange, animatedSignature = 1, topEditing, setTopEditing, editable, signature, large, loading, onChange, id }) => {
    const [editing, setEditing] = useState(editable);
    const [drawSignature, setDrawSignature] = useState(false);
    //@ts-ignore
    const [text, setText] = useAsyncReference(signature);
    const [divwidth, setDivWidth] = useState(0);
    const [showAnimatedSignature, setShowAnimatedSignature] = useState(false);
    if (id.indexOf("popout") >= 0)
        large = true;
    else
        large = false;
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    //console.log("signature editor render", { text: text.current, editable, editing })
    let ref = useRef<HTMLDivElement>(null);
    const handleAnimatedSignatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      //  console.log("onAnimatedSignatureChage", event.target.checked)
        onAnimatedSignatureChange(event.target.checked ? 1 : 0);
    }
    useEffect(() => {
        setDrawSignature(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                // if(editing)
                //  setEditing(false);
                //if(topEditing)
                // setTopEditing(false);

                //console.log("OUTSIDE CLICK - SIGNATURE", text.current,signature)
                if (text.current != signature){
                   // console.log("call onChange signature")
                    onChange(text.current);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setEditing]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        let t = event.target.value;
        const tooLong = event.target.value.split('\n').length > 2;
        if (tooLong)
            t = t.substring(0, t.length - 1);

        setText(t);
       // console.log("click setText:", { text: event.target.value, t, tooLong })
    };

    useEffect(() => {
        const div = ref?.current;
       // console.log("width-div", div);
        const width = div?.clientWidth || 0;// ? div.clientWidth > 500 ? div.clientWidth : 552 : 552;
        setDivWidth(width + 10 - 4);
       // console.log("set width:", width);
    }, [ref.current]);
   // console.log("creating signatureText", text.current)
    const signatureText = text?.current ? text.current.split('\n').map((m: string, i: number) => <SignatureLine id={"wt-signature-line" + i} key={i} l={signature.length} large={large}>{m}</SignatureLine>) : null;
    const varaText: string[] = text && text?.current ? text.current.split('\n') : [''] || [''];
    //console.log("varaText", varaText, typeof varaText);

    return (
        <Editor onFocus={() => setShowAnimatedSignature(true)} onBlur={() => setShowAnimatedSignature(false)} editable={editable} topEditing={topEditing} divwidth={divwidth} ref={ref} l={text.current.length || 0} large={large || false}>
            {!editable && drawSignature && <Wrap onClick={() => { console.log("CLICK - signature"); if (editable) { setEditing(true); setTopEditing(true); } }}>
                <SignatureContainer>
                    {!animatedSignature && <Signature id="wt-signatrue">
                        {signatureText ? signatureText : ''}      </Signature>}

                    {animatedSignature === 1 && varaText && <Signature id="wt-signatrue">
                        <VaraWrap large={large || false} l={text.length}>
                            <VaraText text={varaText} id={id} />
                        </VaraWrap>
                    </Signature>}

                </SignatureContainer>
            </Wrap>}
            <BottomWrap>
                {editable && <EditorBox >
                    <SignatureContainer>
                        <Signature>
                            <FormControlLabel
                                disabled={!editable}
                                sx={{ mt: 2, p: 0 }}
                                labelPlacement="top"
                                label={<Typography style={{ color: theme.palette.text.secondary }}></Typography>}
                                control={
                                    <StyledTextareaAutosize
                                        disabled={!editable}
                                        aria-label="signature editor"
                                        minRows={1}
                                        autoFocus={true}
                                        placeholder="Add up to 2 lines of the handwritten signature."
                                        onChange={handleChange}
                                        value={text.current}
                                    />
                                }
                            />
                        </Signature>
                    </SignatureContainer>
                </EditorBox>}
                {editable && <AnimatedSignature >
                    <FormControlLabel
                        label="Animate handwriting"
                        labelPlacement="start"
                        style={{ fontSize: 8 }}
                        onFocus={() => setShowAnimatedSignature(true)} onBlur={() => setShowAnimatedSignature(false)}
                        control={
                            <Checkbox
                                sx={{ color: 'lightBlue' }}
                                size='small'
                                checked={animatedSignature === 1}
                                onChange={handleAnimatedSignatureChange}
                            />
                        }
                    />
                </AnimatedSignature>}
            </BottomWrap>
        </Editor>
    )
}
export default SignatureEditor;