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
    large?: boolean;

}
const Headline = styled.div<BodyProps>`
    width:100%;
    display:flex;
    justify-content:center;
    font-size: ${({ large }) => large ? 22 : 22}px;
    font-weight: 700;
    //font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    text-align: center;
    padding: 2px;
    z-index:100;
    p{ 
        margin-block-end: 0px !important;
    }
    margin-block-end: 0px !important;
    @media (max-width: 600px) {
        font-size: ${({ large }) => large ? 22 : 9}px;
    }
    @media (min-width: 900px) {
      font-size: 19px;
    }
    &.q-h{
      z-index:100;
      position:relative
    }
  `;

const HeadlineWrap = styled.div`
    width:100%;
   // margin-bottom:10px;
`;

const StyledTextareaAutosize = styled(TextareaAutosize)`
    &:focus-visible {
      outline: 0;
    }
    background:inherit;
    color: inherit;
    overflow:auto;
    width:100%;
   // height:100%;
    padding:2px;
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
    margin-block-end: 0px !important;
    cursor: ${({ editable }) => editable ? 'text' : 'default'};
    align-items:center;
    padding:0px;
   // margin-top:10px;
   // margin-bottom:10px;
    width:100%;
   // min-height:40px;
   // border: ${({ topEditing }) => topEditing ? 'none' : '1px dashed red'}; /* Change the color as needed */
    & textarea{
        width:${({ divwidth }) => divwidth ? (divwidth - 14) + 'px' : '100%'};
        max-width:${({ divwidth }) => divwidth ? (divwidth - 14) + 'px' : '100%'};
       // min-width:${({ divwidth }) => divwidth ? divwidth + 'px' : '100%'};
       // font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        line-height:1.7;
        font-weight: 700;
        text-align:center;
        font-size: ${({ large }) => large ? 22 : 15}px;
        @media (max-width: 600px) {
            font-size: ${({ l }) => l > 15 ? 17 : 19}px;
    }
    @media (min-width: 900px) {
        font-size: ${({ l }) => l > 15 ? 17 : 19}px;
    }
    } 
`;

const EditorBox = styled.div`
  cursor: text;
  margin-block-end: 0px !important;
  & textarea{
    resize:none;
    width:100%;
    overflow:auto;
   // background:#ffe;
   border:none;
  }
//  padding-top:18px;
  //padding-bottom:24px;
  border:none;
 
`;

interface HeadlineProps {
    headline: string;
    large: boolean;
    loading: boolean;
    editable: boolean;
    topEditing: boolean;
    setTopEditing: (editing: boolean) => void;
    onChange: (headline: string) => void;
    id: string;
}

const HeadlineEditor: React.FC<HeadlineProps> = ({ id, topEditing, setTopEditing, editable, headline, large, loading, onChange }) => {
    const [headlineEditing, setHeadlineEditing] = useState(editable);
    const [text, setText] = useState(headline);
    const [divwidth, setDivWidth] = useState(0);
    const theme = useTheme();
    console.log("debug headline:", headline, text, editable, headlineEditing)
    if (id.indexOf("popout") >= 0)
        large = true;
    else
        large = false;
    useEffect(() => {
        //console.log("debug: headline setText", headline, text);
        if (headline != text) {
            setText(headline);
        }
    }, [headline]);
    let ref = useRef<HTMLDivElement>(null);
    /* useEffect(() => {
         const keyDownHandler = (event:any) => {
             console.log('User pressed: ', event.key);
     
             if (event.key === 'Escape'||event.key === 'Enter') {
                 event.preventDefault();
                 console.log("ESCAPE headline",text)
                 onChange(text);
                 setHeadlineEditing(false);
                 setTopEditing(false);
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
                //if(headlineEditing)
                //     setHeadlineEditing(false);
                //if(topEditing)
                //      setTopEditing(false);
                if (text != headline)
                    onChange(text);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setHeadlineEditing]);

    const handleHeadlineChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(event.target.value);
        console.log("setHeadline:", event.target.value)
        onChange(event.target.value);
    };
    const handleUpdate = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(event.target.value);
       
    };
    useEffect(() => {

        const div = ref?.current;
        console.log("width-div", div);
        const width = div?.clientWidth || 0;// ? div.clientWidth > 500 ? div.clientWidth : 552 : 552;
        setDivWidth(width + 10 - 4);
        console.log("set width:", width);
    }, [ref.current]);
    //console.log("debug: headline render",text)
    return (
        <Editor className={josefin.className} editable={editable} topEditing={topEditing} divwidth={divwidth} ref={ref} l={text.length || 0} large={large || false}>
            {!editable && <HeadlineWrap onClick={() => { console.log("CLICK - headline"); if (editable) { setHeadlineEditing(true); setTopEditing(true); } }}>
                <Headline l={text.length} large={large} className="q-h" >
                    <ReactMarkdown>
                        {loading ? "" : text.replace('#', '###').replace('####', '##').replace('\n', '')}
                    </ReactMarkdown>
                </Headline>
                {false && large && editable && !headlineEditing && <Typography variant="body2" sx={{ mt: 1 }}>Click to edit</Typography>}
            </HeadlineWrap>}
            {!loading && editable && <EditorBox >
                <FormControlLabel
                    ref={ref}
                    sx={{ width: 1, m: 0, p: 0 }}
                    labelPlacement="top"
                    label={<Typography style={{ color: theme.palette.text.secondary }}></Typography>}
                    control={
                        <StyledTextareaAutosize
                            className={josefin.className}
                            aria-label="headline editor"
                            // minRows={1}   
                            autoFocus={true}
                            placeholder="Edit the headline"
                            onBlur={handleHeadlineChange}
                            onChange={handleUpdate}
                            value={text.replace('#', '###').replace('####', '##').replace('\n', '')}
                        />
                    }
                />
            </EditorBox>}
        </Editor>
    )
}
export default HeadlineEditor;