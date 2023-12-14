import React from "react";


import { fetchSession, recordEvent, updateSession, deleteSessionHistories, getSessionHistory } from '../../lib/api'

import { useRef, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { AppBar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useRouter } from 'next/router'
import styled from 'styled-components';
import Script from 'next/script'
import ReactMarkdown from "react-markdown";


import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head'
import { blueGrey } from '@mui/material/colors'
import axios from 'axios';
import Image from 'next/image'
//import { useSession, signIn, signOut } from "next-auth/react"
import { Roboto } from 'next/font/google';

import Band from '../band';
import BandCard from '../band-card';
import Card from '../greeting-card/ui21';
import LinearProgress from '@mui/material/LinearProgress';

interface BackgroundMode {
    colorDark: string;
    colorLight: string;
}
interface WebShareProps {
    color: string;
}

const WBLogo = styled.div`
  margin-right:30px;
`;

const Copyright = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-wrap: wrap;

  color:grey;

  `;
const Sub = styled.div`
  margin:20px;
`;


interface FooterProps {
    darkmode: string;
};
const Footer = styled.div<FooterProps>`
    padding:10px 10rem;
    width:100%;
    color:rgb(44, 46, 56);
    background-color: ${({ darkmode }) => darkmode == "true" ? '#252330' : 'rgb(232, 236, 239)'};
    @media (max-width:990px){
        padding:10px;
    }
    `;
const LineContainer = styled.div<FooterProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding:8px;  
    text-align: center;
    color:#2d2b38;
    background-color: ${({ darkmode }) => darkmode == "true" ? '#999' : 'rgb(232, 236, 239)'};
  `;

const BandContainer = styled.div<{ darktext?: string, background?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
  background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
  background-image: ${({ background }) => background ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})` : null}; 
  background-repeat: repeat;
  background-size: 900px 491px;

`;

const Title = styled(Typography)`
  margin-bottom: 1rem;
  @media (max-width: 900px) {
    font-size:2rem;
  }
`;

const Subtitle = styled(Typography)`
  margin-bottom: 2rem;
  text-overflow: wrap;
  padding:10px;
  @media (max-width: 700px) {
    font-size:1rem;;
  }
  
`;

const CTAButton = styled(Button)`
  margin-top: 2rem;
`;

const FirstBandContainer = styled.h1`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  padding: 5rem 0;
  text-align: center;
  background: url('wide-candles.jpg') ; /* Replace with your image URL */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('wide-candles.jpg'); /* Replace with your image URL */
  font-weight:500;
  color: #fff;
  min-height: 380px;
  background-repeat: repeat;

  background-size: 900px 491px;
  font-size:5rem;
  font-size:4rem;
  @media (max-width: 700px) {
    font-size:3rem;
  }
  
`;
const SecondBandContainer = styled.div`
  display: flex;
  position:relative;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
  background: url('wide-candles.jpg') ; /* Replace with your image URL */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('wide-christmas-candles.jpg'); /* Replace with your image URL */
 
  color: #fff;
  min-height: 380px;
  background-repeat: repeat;

  background-size: 900px 491px;
  font-size:4rem;
  @media (max-width: 700px) {
    font-size:3rem;
  }
  
`;


const ImageDemo = styled.div`
//max-width: 100%;
//padding:60px;
position:relative;
width:${1380 / 3}px;
height:${777 / 3}px;
  
//height:fit-content;
@media (max-width: 700px) {
    width:${1380 / 5}px;
    height:${777 / 5}px;
  }
margin-top:40px;
`;
/*const demoImage = {
    url: 'https://res.cloudinary.com/dhmqojhnk/image/upload/v1690915099/r34orqivo5jbw2wgbmki.jpg',
    publicId: 'r34orqivo5jbw2wgbmki',
    height: 576,
    width: 448,
    thumbnailUrl: 'https://res.cloudinary.com/dhmqojhnk/image/upload/c_limit,h_60,w_90/v1690915099/r34orqivo5jbw2wgbmki.jpg',
    original_filename: '9YdrCeYYIiPp121N7nAL--1--6k1ra'
}*/
const demoImage = {
    publicId: 'iouobvcdnozd6kkxp2yy',
    url: 'https://res.cloudinary.com/dhmqojhnk/image/upload/v1689786872/iouobvcdnozd6kkxp2yy.jpg',
    height: 1152,
    width: 832,
    thumbnailUrl: 'https://res.cloudinary.com/dhmqojhnk/image/upload/c_limit,h_60,w_90/v1689786872/iouobvcdnozd6kkxp2yy.jpg',
    original_filename: '2wgwijScIBqFIAlyGlG6--1--5xj0f'
}

const Body = styled.div`
  width:100%;
`;

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v = false;
interface LandingProps {
    dark: number, 
    fresh: boolean, 
    fbclid: string, 
    utm_content: string, 
    isbot: number, 
    isfb: number, 
    sessionid: string

}
const Landing: React.FC<LandingProps> = ({ dark, fresh, fbclid, utm_content, isbot, isfb, sessionid }: LandingProps) => {
    const myRef = useRef(null);
    const [myElementIsVisible, updateMyElementIsVisible] = useState(false);
    const [darkMode, setDarkMode] = React.useState(true);
    const [systemMode, setSystemMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const handleCTAClick = (ctaTag: string) => {
        setLoading(true);
        try {
            recordEvent(sessionid, 'landing-cta-click', `{"fbclid":"${fbclid}","utm_content":"${utm_content}","cta_tag":"${ctaTag}"}`);
        } catch (x) {
            console.log('landingCardRevealError', x);
        }
        router.push(`/start?fbclid=${fbclid}&utm_content=${utm_content}`);
    };
    useEffect(() => {
        const observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.isIntersecting && !myElementIsVisible) {
                try {
                    recordEvent(sessionid, 'landing-card-reveal', `{"fbclid":"${fbclid}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('landingCardRevealError', x);
                }
            }
            updateMyElementIsVisible(entry.isIntersecting);
        });
        if (myRef.current)
            observer.observe(myRef.current);
    }, []);
    let theme: any;
    if (darkMode) {
        theme = createTheme({
            palette: {
                mode: 'dark',
                background: {
                    default: '#2d2b38',//' blueGrey[900],
                    paper: blueGrey[600],
                }
            },
        })
    }
    else {
        theme = createTheme({
            palette: {
                mode: 'light',
            },
        })
    }
    useEffect(() => {
        if (dark) {
            setDarkMode(true);
        }
    }, [dark]);
    const modeMe = (e: any) => {
        setDarkMode(!!(e.matches));
        setSystemMode(!!(e.matches));
    };

    React.useEffect(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
        setSystemMode(matchMedia.matches);
        if (matchMedia.matches != darkMode) {
            document.body.setAttribute("data-theme", matchMedia.matches ? 'dark' : 'light');
            setDarkMode(!!(matchMedia.matches));
        }
        // setDarkMode(matchMedia.matches);
        matchMedia.addEventListener("change", modeMe);

        return () => matchMedia.removeEventListener("change", modeMe);
    }, [darkMode]);

    const line1 = `Find the right words with the assistance of the award winning AI.   
    Optimized for social media and messengers.   
    Emojis galore:
    🎑 🎃 👻 🎅 🎄 🎁   
    Best of all: It's free!    
    `
    const line2 = `Begin by simply selecting the occasion.   
    Explore what is possible with advanced customization options.`

    const line3 = `Gift suggestions with no effort.   
        Happy or sad, the AI assistant will help you find the right gifts. 
    `
    const greeting = `{"headline":"🎉 Happy 12th Birthday to my awesome son! 🎂","body":"Hope you have a fantastic day filled with fun, laughter, and loads of cake! 🎈🍰 You're growing up so fast, but always remember to stay true to yourself and keep spreading those infectious smiles. 😄 Love you to the 🌙 and back!"}`
    const signature = 'Enjoy and be happy,\n your Dad!';
    const image = '';
    const canvasRef = React.useRef<HTMLDivElement>(null);
    const popoutRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <Head>
                <title>Wish Text</title>
                <meta name="name" content="Create a Greeting Card for Social Media" />
                <meta name="slogan" content="Online Greeting Cards with the help of AI" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@wishtext" />
                <meta name="twitter:title" content="AI-Assisted Wish Text And Greeting Cards" />
                <meta name="twitter:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost."/>
                <meta name="twitter:image" content="/demo-card5-small.png" />
                <meta name="title" content="AI-Assisted Wish Text And Greeting Cards" />
                <meta property="og:title" content="AI-Assisted Wish Text And Greeting Cards" />
                <meta property="og:image" content="/demo-card5-small.png" />
                <meta name="description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
                <meta property="og:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
                <link rel="icon" href={systemMode ? "/wbLogo.png" : "/bwLogo.png"} sizes="64x63" type="image/png" />
                <meta name="theme-color" content={theme.palette.background.default} />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://www.wish-text.com/" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet" />

            </Head>
            <ThemeProvider theme={theme}>
                <main className={roboto.className} >

                    <div>

                        <CssBaseline />
                        <AppBar position="absolute" component="nav">
                            <Toolbar>

                                <WBLogo><Image src="/wbLogo-grey.png" width={32} height={31} alt="Wish Text Composer Logo" /></WBLogo>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                                >
                                    WISH TEXT AND GREETING CARDS COMPOSER
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }}
                                >
                                    WISH TEXT
                                </Typography>


                            </Toolbar>
                        </AppBar>



                    </div>
                    <div >
                        <Script src={`https://www.googletagmanager.com/gtag/js?${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
                        <Script id="google-analytics">
                            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
                        </Script>
                    </div>
                    <Body>
                        <FirstBandContainer>
                            AI-Assisted Custom Cards
                        </FirstBandContainer>
                        {false && <LineContainer darkmode={"false"} />}
                        <Band setLoading={setLoading} loading={loading} card={null} fresh={fresh} fbclid={fbclid} utm_content={utm_content} isbot={isbot} isfb={isfb} sessionid={sessionid} dark={"true"} title="Create and Share a Card&nbsp; With Ease!" subtitle={line1} cta="Create a Card" />



                        <SecondBandContainer>
                            <Title variant="h3">
                                Messages To Celebrate,<br />
                                To Comfort, To Encourage.
                            </Title>
                            <Subtitle variant="h5">
                                <ReactMarkdown>{line2}</ReactMarkdown>
                            </Subtitle>
                            {loading ? <LinearProgress /> :
                                <CTAButton variant="contained" color="primary" onClick={() => handleCTAClick("2")}>
                                    Start Creating Now!
                                </CTAButton>}
                        </SecondBandContainer>

                        <div ref={myRef} >
                            {myElementIsVisible && <BandCard
                                setLoading={setLoading}
                                loading={loading}
                                extra="card=true"
                                dark="true"
                                card={
                                    //<Card animatedSignature={animatedSignature} editable={false} onAnimatedSignatureChange={()=>{}}  onGreetingChange={()=>{}} onImageChange={()=>{}} onSignatureChange={()=>{}} canvasRef={canvasRef} delayOpen={true} large={true} signature={signature} fbclid={""} utm_content={""} dark={dark} text={text || ''} image={image} />
                                    <Card popoutRef={popoutRef} animatedSignature={1} editable={false} onAnimatedSignatureChange={() => { }} onGreetingChange={() => { }} onImageChange={() => { }} onSignatureChange={() => { }} canvasRef={canvasRef} delayOpen={true} cardlarge={true} signature={signature} fbclid={fbclid} utm_content={utm_content} dark={darkMode ? "true" : "false"} text={greeting || ''} image={demoImage} />}
                                fresh={fresh} fbclid={fbclid} utm_content={utm_content} isbot={isbot} isfb={isfb} sessionid={sessionid}
                                title="Create Virtual Wishing Cards" subtitle={"Create beautiful wish cards"} cta="Create a Wish Card Now!" />
                            }
                        </div>
                        <BandContainer darktext={"true"} background={"gifts-candles-wide.jpg"}>
                            <Title variant="h3">
                                Gift Recommendations For Any Occasion
                            </Title>
                            <Subtitle variant="h5">
                                <ReactMarkdown>{line3}</ReactMarkdown>
                            </Subtitle>
                            {loading ? <LinearProgress /> :
                                <CTAButton variant="contained" color="primary" onClick={() => handleCTAClick("4")}>
                                    Begin Now
                                </CTAButton>}

                        </BandContainer>

                        {false && <BandContainer>
                            <Title variant="h3">
                                Upload your images and create greeting cards
                            </Title>
                            <Subtitle variant="h5">
                                Download on your device<br /> and use in social networks <br />and messengers
                                with the direct upload.
                                <ImageDemo>
                                    <img src="/demo-card1-small.png" width="100%" alt="Wish Text Composer Logo" />
                                </ImageDemo>
                                <ImageDemo>
                                    <img src="/demo-card5-small.png" width="100%" alt="Wish Text Composer Logo" />
                                </ImageDemo>
                                <ImageDemo>
                                    <img src="/demo-card3-small.png" width="100%" alt="Wish Text Composer Logo" />
                                </ImageDemo>

                            </Subtitle>
                            {loading ? <LinearProgress /> : <CTAButton variant="contained" color="primary" onClick={() => handleCTAClick("5")}>
                                Let us show you how!
                            </CTAButton>}
                        </BandContainer>}

                    </Body>
                    <Footer darkmode={"false"}>
                        <Copyright>

                            <Sub>
                                <Typography variant="caption" gutterBottom>Create the &quot;wishing&quot; or greeting text for you to paste into your favorite messaging app.
                                    AI will provide the helpful suggestions that you can edit by clicking on the suggestion.

                                    Additionally, Wish Text Composer can help you to create an online &apos;wish card&apos;, a greeting card using stock or an uploaded image.
                                    Utilizing AI, it also provides the gift suggestions.
                                </Typography>
                            </Sub>
                        </Copyright>
                        <Copyright> <Sub> <Typography variant="caption" gutterBottom>
                            Copyright 2023 Wish-Text.Com, All Rights Reserved
                        </Typography></Sub>
                            <Sub><Typography variant="caption" gutterBottom>
                                Contact: support@hudsonwilde.com
                            </Typography></Sub>
                            <Sub><Typography variant="caption" gutterBottom>
                                Crafted in Northern Minnesota, USA.
                            </Typography></Sub>
                        </Copyright>
                    </Footer>
                </main>

            </ThemeProvider>
        </>
    )
}  
export default Landing;