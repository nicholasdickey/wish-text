

import styled from "styled-components";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { gsap } from "gsap";
const Centered=styled.div`
display:flex;
justify-content:center;
align-items:center;
`
interface Props {
    dark: string,
    fbclid: string,
    utm_content: string,
    text: string,
    image?: ImageData,
    signature: string,
    session?: any;
    linkid: string;
    create: boolean;

}
const GreetingCard: React.FC<Props> = ({ create, linkid, dark, fbclid, utm_content, text, image, signature, session }) => {
    const comp = useRef(); // create a ref for the root level element (we'll use it later)
    const boxRef = useRef(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let context;
    useEffect(() => {
        context=canvasRef.current?.getContext('2d')??null;
        // Refs allow you to access DOM nodes
        console.log(boxRef) // { current: div.box }
        // then we can animate them like so...
        gsap.to(boxRef.current, {
            rotation: "+=90"
        });
        // -- ANIMATION CODE HERE --

        return () => {
            // cleanup code (optional)
        }

    }, []); // <- empty dependency Array so it doesn't re-run on every render!
    return (
        <Centered className="App">
            <div className="box" ref={boxRef}>Hello</div>
            <canvas ref={canvasRef} id="tutorial" width="150" height="150">This is Learning Canvas</canvas>
        </Centered>
    );
}
export default GreetingCard;

