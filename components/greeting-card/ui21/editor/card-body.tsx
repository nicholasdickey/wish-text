import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { Josefin_Sans } from 'next/font/google'
const josefin = Josefin_Sans({ subsets: ['latin'] })
import ReactMarkdown from "react-markdown";
interface BodyProps {
    l: number;
    large: boolean;
}
const TextBody = styled.div<BodyProps>`
    width:100%;
    //display:flex;

    //justify-content:center;
    font-size:${({ l, large }) => large ? (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 7) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
    font-weight: 400;
    padding:2px;
   // font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height:1.7;
  
    //padding-bottom:20px;
    //margin-bottom: 40px;
    @media (min-width:600px) {
        font-size:${({ l, large }) => large ? (l > 600 ? 9 : l > 400 ? 10 : l > 300 ? 11 : l > 200 ? 12 : 13) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
    }
 
`;

const Wrap = styled.div`
    position:relative;
    width:100%;
   margin-top:12px;
   // margin-bottom:80px;
`;

const StyledTextareaAutosize = styled(TextareaAutosize)`
    
    &:focus-visible {
      outline: 0;
    }
    border: 1px solid red;
    background:inherit;
    color: inherit;
    overflow:auto;
    min-width:100%;
    height:100%;
    //border:none;
   // padding:6px;
`;
interface WidthProps {
    divwidth: number;
    l: number;
    large: boolean;
    topEditing: boolean;
    editable: boolean
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
    //margin-top:10px;
    //width:${({ divwidth }) => divwidth ? (divwidth - 2) + 'px' : '100%'};
    //height:100%;
    //min-height:80px;
    /*:hover{
        border: ${({ topEditing }) => topEditing ? 'none' : '1px dashed red'};
    }*/

    .MuiFormControlLabel-root{
        width:${({ divwidth }) => divwidth ? (divwidth - 12) + 'px' : '100%'};
    }
    & textarea{
        width:${({ divwidth }) => divwidth ? (divwidth - 12) + 'px' : '100%'};
        max-width:${({ divwidth }) => divwidth ? (divwidth - 12) + 'px' : '100%'};
       // min-width:${({ divwidth }) => divwidth ? divwidth + 'px' : '100%'};
       // font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        line-height:1.7;
        text-align:center;
        font-size:${({ l, large }) => large ? (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 7) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
        font-weight: 400;
        @media (min-width:600px) {
            font-size:${({ l, large }) => large ? (l > 600 ? 9 : l > 400 ? 10 : l > 300 ? 11 : l > 200 ? 12 : 13) : (l > 600 ? 2 : l > 400 ? 3 : l > 300 ? 4 : l > 200 ? 5 : 6)}px;
        }
    }
`;

const EditorBox = styled.div`
  //width:100%;
  //margin-top:0px;
  padding-top:15px;
 // margin-left:18px;
  position:relative;
  text-align:center;
  padding-left:0px;
  padding-right:0px;
  cursor: text;
  & textarea{
    //width:100%;
    overflow:auto;
   // padding-left:9px;
  //  background:#ffe;
   // resize: none;
    resize: none;
border:none;

  
  }
  
  padding-left:0px;
  padding-right:0px;
  //padding-top:40px;
 // padding-bottom:40px;
`;

interface Props {
    body: string;
    large: boolean;
    loading: boolean;
    editable: boolean;
    onChange: (headline: string) => void;
    topEditing: boolean;
    setTopEditing: (editing: boolean) => void;
}

const BodyEditor: React.FC<Props> = ({ topEditing, setTopEditing, editable, body, large, loading, onChange }) => {
    const [editing, setEditing] = useState(editable);
    const [text, setText] = useState(body);
    const [divwidth, setDivWidth] = useState(0);
    const theme = useTheme();
    //console.log("topEditing",topEditing)
    let ref = useRef<HTMLDivElement>(null);
    /* useEffect(() => {
         const keyDownHandler = (event: any) => {
             console.log('User pressed: ', event.key);
 
             if (event.key === 'Escape' ) {
                 event.preventDefault();
                 console.log("ESCAPE headline", text)
                 onChange(text);
                 setEditing(false);
             }
         };
         document.addEventListener('keydown', keyDownHandler);
         return () => {
             document.removeEventListener('keydown', keyDownHandler);
         };
     }, []);*/

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                // if(editing)
                //  setEditing(false);
                // if(topEditing)
                //   setTopEditing(false);
                if (text != body)
                    onChange(text);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setEditing]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(event.target.value);
        console.log("setBody:", event.target.value)
    };

    useEffect(() => {
        const div = ref?.current;
        console.log("width-div", div);
        const width = div?.clientWidth || 0;// ? div.clientWidth > 500 ? div.clientWidth : 552 : 552;
        setDivWidth(width + 10 - 4);
        console.log("set width:", width);
    }, [ref.current]);
    return (
        <Editor className={josefin.className} editable={editable} topEditing={topEditing} divwidth={divwidth} ref={ref} l={text.length || 0} large={large || false}>
            {!editing && <Wrap onClick={() => { console.log("CLICK - body"); if (editable) { setEditing(true); setTopEditing(true); } }}>
                <TextBody l={text.length || 0} large={large || false}  >
                    <ReactMarkdown>
                        {loading ? "" : text.replace('#', '###').replace('####', '##')}
                    </ReactMarkdown>
                </TextBody>

            </Wrap>}
            {false && large && editable && !editing && <Typography variant="body2" sx={{ mt: 2 }}>Click to edit</Typography>}

            {editing && <EditorBox >

                <FormControlLabel

                    sx={{ border: 0, m: 0, p: 0 }}
                    labelPlacement="top"
                    label={<Typography style={{ color: theme.palette.text.secondary }}></Typography>}
                    control={
                        <StyledTextareaAutosize
                            aria-label="message editor"
                            className={josefin.className}
                            minRows={4}
                            autoFocus={true}

                            // resize="none"
                            placeholder="Edit the message"
                            onChange={handleChange}

                            defaultValue={text}
                        />
                    }
                />

            </EditorBox>}
        </Editor>
    )
}
export default BodyEditor;