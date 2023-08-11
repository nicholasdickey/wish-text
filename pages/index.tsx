import * as React from 'react';
import { useState, useCallback, useEffect } from "react"
import { useRouter } from 'next/router'
import styled from 'styled-components';
import Script from 'next/script'
import {
  GetServerSidePropsContext,
} from "next";
import Image from 'next/image'
import Head from 'next/head'
import { Roboto } from 'next/font/google';


//mui
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors'

import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
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
import ClearIcon from '@mui/icons-material/Clear';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import LooksThreeOutlinedIcon from '@mui/icons-material/Looks3Outlined';
import LooksFourOutlinedIcon from '@mui/icons-material/Looks4Outlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';//'@mui/icons-material/LightbulbCircleTwoTone';//'@mui/icons-material/MarkUnreadChatAltOutlined';//'@mui/icons-material/NextPlanOutlined';//'@mui/icons-material/ErrorOutlineOutlined';
import NextPlanOutlinedIcon from '@mui/icons-material/NextPlanOutlined';
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import LightbulbCircleTwoToneIcon from '@mui/icons-material/LightbulbCircleTwoTone';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';

//third-party
import { RWebShare } from "react-web-share";
import axios from 'axios';

//project
import { deleteSessionCards, deleteSessionImages, fetchSession, fetchSessionImages, recordEvent, updateSession, deleteSessionHistories, getSessionHistory, fetchSharedImages } from '../lib/api';
import ImageData from "../lib/image-data";
import CardData from "../lib/card-data";
import GreetingCard from '../components/greeting-card/card-editor';
import { withSessionSsr, Options } from '../lib/with-session';
import GreetingOutput from "../components/output";
import GiftsOutput from "../components/gifts";
import AvatarMenu from "../components/avatar-menu";
import * as ga from '../lib/ga'
import Combo from "../components/combo-text";
import { isbot } from '../lib/isbot'
import PlayerToolbar from "../components/toolbar-player";
import Section from "../components/greeting-card/editor-section";

const OvalButton = styled(Button)`
  border-radius: 14px;
  `;
const ModeSwitch = styled.div`
  position:absolute;
  right:200px;
  top:20px;  
  z-index:100; 
  color:white; 
 
  @media (max-width: 700px) {
    top:0px;
    right:0px;
    font-size:3rem;;
    min-height: 120px;
  }
  `;
interface BackgroundMode {
  colorDark: string;
  colorLight: string;
}
const Background = styled.div<BackgroundMode>`
  z-index:-100;
  //background2: ${({ colorDark, colorLight }) => `linear-gradient(to top, ${colorDark}, ${colorLight})`};
`;
interface WebShareProps {
  color: string;
}
const WebShare = styled.div<WebShareProps>`
  color:${props => props.color};
`;
const WBLogo = styled.div`
  margin-right:30px;
`;
const Starter = styled.div`
  display:flex;
  justify-content:flex-start;
  font-size:36px;
  align-items:center;
  margin-bottom:10px;
  `;
const StarterMessage = styled.div`
  font-size:14px;
  padding-left:10px;
  padding-right:10px;

  `;
const Wide = styled.div`
  position:relative;
   width:100%; 
    `;
const Logo = styled.div`
  position:absolute;

  display:flex;
  align-items:center;
  justify-content: center;
  z-index:20;
`;
const LogoContainer = styled.div`
  margin-top:50px;
  z-index:-1;
  `;
const Copyright = styled.div`
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-wrap: wrap;
  //margin-top:20px;
  color:grey;

  `;
const HR = styled.div`
  width:100%;
 // margin:10px;
  color:grey;
  text-align:center;
`;
const Sub = styled.div`
  width:100%;
 // margin:10px;
  text-align:center;
`;
const ClearButton = styled(IconButton)`
  width: auto;
 `;
const ActionContainer = styled.div`
  margin-top:20px;
  display: flex;
  justify-content:flex-end;
  width: 100%;
`;
const ClearText = styled.span`
  font-size: 12px;
`;

interface ColorProps {
  color: string;
}
const AppMenu = styled.div<ColorProps>`
  display:flex;
  color:${({ color }) => color};
`;
const FirstBandContainer = styled.h1`
  display: flex;
  width: 100%;
  align-items: center;
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
  font-size:4rem;
  margin-top:60px;
  margin-block-end: 0px;
  @media (max-width: 700px) {
    margin-top:50px;
    font-size:3rem;;
    height: 120px;
    padding:40px
  }
  
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

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v = false;
export default function Home({ linkid: startLinkid, card: startCard = false,
  signature: startSignature,
  sharedImages, dark, num: startNum = 0, max: startMax = 0, cardNum: startCardNum,
  cardMax: startCardMax,
  prompt1: startPrompt1, prompt2: startPrompt2, prompt3: startPrompt3,
  prompt4: startPrompt4, prompt5: startPrompt5, prompt6: startPrompt6, promptImageStrip: startPromptImageStrip,
  utm_medium, isbot, isfb, virgin: startVirgin, virgin2: startVirgin2,
  naive: startNaive, from: startFrom, to: startTo, occasion: startOccasion,
  reflections: startReflections, instructions: startInstructions, images: startImages,
  inastyleof: startInastyleof, language: startLanguage, interests: startInterests,
  ironsession: startSession }:
  { linkid: string, card: boolean, signature: string, sharedImages: ImageData[], images: ImageData[], dark: boolean, num: number, max: number, cardNum: number, cardMax: number, prompt1: boolean, prompt2: boolean, prompt3: boolean, prompt4: boolean, prompt5: boolean, prompt6: boolean, promptImageStrip: boolean, utm_medium: string, isbot: boolean, isfb: boolean, virgin: boolean, virgin2: boolean, naive: boolean, from: string, to: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language: string, interests: string, ironsession: Options }) {

  const emptyImage: ImageData = {
    url: '',
    publicId: '',
    height: 0,
    width: 0,
    thumbnailUrl: '',
    original_filename: ''
  };
  const [session, setSession] = useState(startSession);
  const [noExplain, setNoExplain] = useState(session.noExplain || false);
  const [occasion, setOccasion] = useState(startOccasion);
  const [virgin, setVirgin] = useState(startVirgin);
  const [virgin2, setVirgin2] = useState(startVirgin2);

  const [prompt1, setPrompt1] = useState(startPrompt1);
  const [prompt2, setPrompt2] = useState(startPrompt2);
  const [prompt3, setPrompt3] = useState(startPrompt3);
  const [prompt4, setPrompt4] = useState(startPrompt4);
  const [prompt5, setPrompt5] = useState(startPrompt5);
  const [prompt6, setPrompt6] = useState(startPrompt6);
  const [promptImageStrip, setPromptImageStrip] = useState(startPromptImageStrip);

  const [max, setMax] = useState(startMax);
  const [card, setCard] = useState(startCard);
  const [naive, setNaive] = useState(startNaive);
  const [reflections, setReflections] = useState(startReflections);
  const [instructions, setInstructions] = useState(startInstructions);
  const [inastyleof, setInastyleof] = useState(startInastyleof);
  const [language, setLanguage] = useState(startLanguage);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [from, setFrom] = useState(startFrom);
  const [to, setTo] = useState(startTo);
  const [interests, setInterests] = useState(startInterests);
  const [loadReady, setLoadReady] = useState(true);
  const [virginEvent, setVirginEvent] = useState(false);

  const [darkMode, setDarkMode] = React.useState(startSession.mode);
  const [modeIsSet, setModeIsSet] = React.useState(startSession.modeIsSet);
  const [systemMode, setSystemMode] = React.useState(false);
  const [greeting, setGreeting] = useState(session.greeting || '');
  const [num, setNum] = useState<number>(session.num || 0);



  //const { data: authSession } = useSession();
  const router = useRouter();
  //const theme = useTheme();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [missingOccasion, setMissingOccasion] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState(startOccasion);

  //greeting card state:
  const [image, setImage] = useState<ImageData>(session.image || emptyImage);
  const [signature, setSignature] = useState<string>(session.signature || '');
  const [linkid, setLinkid] = useState<string>(startLinkid);
  const [cardNum, setCardNum] = useState<number>(startCardNum);
  const [cardMax, setCardMax] = useState<number>(startCardMax);



  const [images, setImages] = useState<ImageData[]>(startImages);
  const [newCardsStack, setNewCardsStack] = useState<CardData[]>(session.newCardStackString ? JSON.parse(session.newCardStackString) : []);
  //-----------------------------------------------------------

  const drawerWidth = 240;
  const navItems = ['Home', 'History', 'Share', 'Contact', 'Login'];

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
  if (!virgin && !virginEvent && !v && !isbot) {
    v = true;
    setVirginEvent(true);
    setTimeout(async () => await recordEvent(session.sessionid, 'virgin load', isfb ? 'facebook:' + utm_medium : utm_medium ? utm_medium : ''), 1000);
  }
  const handleAccordeonChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      ga.event({
        action: "accordion",
        params: {
          sessionid: session.sessionid
        }
      })
      setTimeout(async () => await recordEvent(session.sessionid, 'accordion', panel), 1000);

      setPrompt3(true);
      updateSession2({ prompt3: true });
    };
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleNoExplanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoExplain(event.target.checked);
    updateSession2({ noExplain: event.target.checked });
    ga.event({
      action: "setNoExplain",
      params: {
        sessionid: session.sessionid
      }
    })
  }
  const handleMenuClick = (item: string) => {
    //console.log('handleMenuClick', item);
    if (item == 'Login') {
      // signIn();
    }
    else
      router.push(`/${item.toLowerCase()}`);
  }
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        WISH TEXT GENERATOR
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleMenuClick(item)}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = undefined;
  //saves the changes to the session on the local web server. 
  const updateSession2 = useCallback(async (updSession: object) => {
    if (!updSession)
      return;
    let curSession: any;
    setSession((session) => { curSession = session; return { ...Object.assign(session, updSession) } });
    setTimeout(async () => {
      const s = (): any => curSession;
      const ses = s();
      console.log('===>pdate session:', updSession, "exist session", ses, curSession, session);

      await axios.post(`/api/session/save`, { session: ses });
    }, 200);

  }, [session, session.greeting]);
  useEffect(() => {
    if (dark && !modeIsSet) {
      setDarkMode(true);
      setModeIsSet(true)
      updateSession2({ mode: true, modeIsSet: true, blah: 'pblah' });
      // setSystemMode(true);
    }
  }, [modeIsSet, dark, session?.mode]);

  const modeMe = (e: any) => {
    //if(!modeIsSet){
    setDarkMode(!!(e.matches));
    updateSession2({ mode: e.matches, blah: 'bleh', modeIsSet: false });
    setSystemMode(!!(e.matches));
    // }
  };
  // console.log("_app:darkMode",darkMode,session?.mode||"")
  React.useEffect(() => {
    console.log("useEffect greeting", greeting, session?.greeting)
    if (greeting != session.greeting) {
      setGreeting(session.greeting || '');
    }
  }, [greeting, session?.greeting])
  React.useEffect(() => {
    console.log("useEffect num", num, session?.num)

    if (num != session.num) {
      setNum(session.num || 1);
    }
  }, [num, session?.num])
  React.useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemMode(!!(matchMedia.matches));
    if (matchMedia.matches != darkMode) {
      //const assigned = { ...Object.assign(session ? session : {}, { mode: matchMedia.matches }) }
      //  setSystemMode(matchMedia.matches);
      document.body.setAttribute("data-theme", matchMedia.matches ? 'dark' : 'light');
      if (!modeIsSet) {
        setDarkMode(!!(matchMedia.matches));
        updateSession2({ mode: matchMedia.matches, blah: 'blah' });
      }
    }
    // setDarkMode(matchMedia.matches);
    matchMedia.addEventListener("change", modeMe);

    return () => matchMedia.removeEventListener("change", modeMe);
  }, [systemMode, darkMode, session?.mode, modeIsSet]);
  //console.log("RENDER", session, num, max, "startNum:", startNum, "startMax:", startMax)
  /*
  React.useEffect(() => {
    console.log("UPDATE session  MODE",mode)
    updateSession2({ mode: mode });
  },[mode,session.mode])
*/
  const updateRoute = useCallback(({ to, from, occasion, naive, reflections, instructions, inastyleof, language, interests, card }: { to: string, from: string, occasion: string, naive: boolean, reflections: string, instructions: string, inastyleof: string, language: string, interests: string, card?: boolean }) => {
    //console.log('value updateRoute', { to, from, occasion, naive, reflections, instructions, inastyleof, language, interests });
    const params = `/${occasion ? '?occasion=' : ''}${occasion ? encodeURIComponent(occasion) : ''}${naive ? `${occasion ? '&' : '?'}naive=${naive}` : ''}${reflections ? `${occasion ? '&' : '?'}reflections=${encodeURIComponent(reflections)}` : ``}${instructions ? `${occasion ? '&' : '?'}instructions=${encodeURIComponent(instructions)}` : ``}${inastyleof ? `${occasion ? '&' : '?'}inastyleof=${encodeURIComponent(inastyleof)}` : ``}${language ? `${occasion ? '&' : '?'}language=${encodeURIComponent(language)}` : ``}${to ? `${occasion ? '&' : '?'}to=${encodeURIComponent(to)}` : ``}${from ? `${occasion ? '&' : '?'}from=${encodeURIComponent(from)}` : ``}${interests ? `${occasion ? '&' : '?'}interests=${encodeURIComponent(interests)}` : ''}${card ? `${occasion ? '&' : '?'}card=${encodeURIComponent(card)}` : ``} `;

    if (occasion)
      router.push(params, params, { shallow: true })
    else
      router.replace(params, params, { shallow: true })

  }, [router]);

  useEffect(() => {
    updateRoute({ to, from, occasion, naive, reflections, instructions, inastyleof, language, interests });
  }, [to, from, occasion, naive, reflections, instructions, inastyleof, language, interests]);
  useEffect(() => {
    if (!virgin)
      ga.event({
        action: "virgin",
        params: {
          sessionid: session.sessionid,
        }
      })
  }, [session.sessionid, virgin]);
  const onOccasionChange = (id: string, value: string) => {
    if (value != "") {
      // console.log("value=", value)
      setMissingOccasion(false);
      updateRoute({
        from,
        to,
        occasion: value,
        naive,
        reflections,
        instructions,
        inastyleof,
        language,
        interests,
      })
      setPrompt1(true);
      updateSession2({ occasion: value, prompt1: true });
    }
    setOccasion(value);
  }

  const onNaiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = !event.target.checked;
    updateRoute({
      from,
      to,
      occasion,
      naive: value,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,
    })
    setNaive(value);
    updateSession2({ naive: value });
  }
  const onReflectionsChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections: value,
      instructions,
      inastyleof,
      language,
      interests,
    })
    setReflections(value);
    updateSession2({ reflections: value });
  }
  const onInstructionsChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions: value,
      inastyleof,
      language,
      interests,
    })
    setInstructions(value);
    updateSession2({ instructions: value });
  }
  const onInastyleofChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof: value,
      language,
      interests,
    })
    setInastyleof(value);
    updateSession2({ inastyleof: value });
  }
  const onLanguageChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language: value,
      interests,
    })
    setLanguage(value);
    updateSession2({ language: value });
  }
  const onFromChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from: value,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,

    })
    setFrom(value);
    updateSession2({ from: value });
  }
  const onToChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to: value,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,

    })
    setTo(value);
    updateSession2({ to: value });
  }
  const onInterestsChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      interests: value,

    })
    setInterests(value);
    updateSession2({ interests: value });
  }
  // console.log("virgin", virgin, virgin2);
  //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
  const processRecord = async (record: any, num: number) => {
    if (!record) return;
    const { greeting, params } = record;
    if (!params) return;
    console.log("PARSE processRecord", params, JSON.parse(params));
    const update = Object.assign(JSON.parse(params), { greeting, num });
    updateSession2(update);
    const { to, from, occasion, naive, reflections, instructions, inastyleof, language, interests } = update;
    setTo(to);
    setFrom(from);
    setOccasion(occasion);
    setNaive(naive);
    setReflections(reflections);
    setInstructions(instructions);
    setInastyleof(inastyleof);
    setLanguage(language);
    setInterests(interests);
    setNum(num);
    session.greeting = greeting;
  }
  //console.log("construct playerToolbar, max=",max)
  const setNumPointer = async (num: number) => {
    console.log("setNumPointer", num)
    const { success, record } = await getSessionHistory(session.sessionid, num);
    console.log("result:", { success, record })
    setNum(num);
    if (success) {
      await processRecord(record, num);
    }
  }

  const OutputPlayerToolbar = <>{max > 1 ? <PlayerToolbar
    num={num}
    max={max}
    onPrevClick={async () => {
      //  console.log("onPrevClick", num, max)
      if (num > 1) {
        const { success, record } = await getSessionHistory(session.sessionid, num - 1);
        //console.log("onPrevClick2", success, record)
        if (success) {
          await processRecord(record, num - 1);
        }
      }
    }}
    onNextClick={async () => {
      if (num < max) {
        const { success, record } = await getSessionHistory(session.sessionid, num + 1);
        if (success) {
          await processRecord(record, num + 1);
        }
      }
    }}
    onFirstClick={async () => {

      const { success, record } = await getSessionHistory(session.sessionid, 1);
      if (success) {
        await processRecord(record, 1);
      }
    }}
    onLastClick={async () => {
      const { success, record } = await getSessionHistory(session.sessionid, max);
      if (success) {
        await processRecord(record, max);
      }
    }}
  /> : null}</>
  const { fbclid, utm_content } = JSON.parse(utm_medium);
  return (
    <>
      <Head>
        <title>Wish Text</title>
        <meta name="name" content="Wish Text" />
        <meta name="slogan" content="Greetings Text" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wishtext" />
        <meta name="twitter:title" content="Wish Text Composer" />
        <meta name="twitter:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost."/>
        <meta name="twitter:image" content="/demo-card5-small.png" />
        <meta name="title" content="Wish Text Composer" />
        <meta property="og:title" content="Wish Text Composer" />
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
      
      </Head>
      <ThemeProvider theme={theme}>
        <main className={roboto.className} >



          <CssBaseline />
          <AppBar position="absolute" component="nav">
            <Toolbar>
              {false ? <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton> : null}
              <WBLogo><Image src="/wbLogo-grey.png" width={32} height={31} alt="Wish Text Composer Logo" /></WBLogo>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                WISH TEXT COMPOSER
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }}
              >
                WISH TEXT
              </Typography>
              <Box sx={{ display: { xs: 'block', sm: 'block' } }}>
                <AppMenu color={theme.palette.text.primary}>
                  <RWebShare
                    data={{
                      text: session.greeting || '',
                      url: `/?occasion=${encodeURIComponent(session.occasion || '')}${session.reflections ? `&reflections=${encodeURIComponent(session.reflections)}` : ``}${session.instructions ? `&instructions=${encodeURIComponent(session.instructions)}` : ``}${session.inastyleof ? `&inastyleof=${encodeURIComponent(session.inastyleof)}` : ``}${session.language ? `&language=${encodeURIComponent(session.language)}` : ``}${session.to ? `&to=${encodeURIComponent(session.to)}` : ``}${session.from ? `&from=${encodeURIComponent(session.from)}` : ``}${session.interests ? `&interests=${encodeURIComponent(session.interests)}` : ``}`,
                      title: 'Wish-Text.Com -  Wish Text Composer',
                    }}
                    onClick={() => {
                      //console.log("shared successfully!");
                      ga.event({
                        action: "share",
                        params: {
                          sessionid: session.sessionid,
                        }
                      })
                      setTimeout(async () => await recordEvent(session.sessionid, 'share', isfb ? 'facebook:' + utm_medium : utm_medium ? utm_medium : ''), 1000);

                    }}
                  >
                    <WebShare color={"white"}><Button color={"inherit"}> <IosShareOutlinedIcon /></Button></WebShare>
                  </RWebShare>

                </AppMenu>
              </Box>

            </Toolbar>
          </AppBar>
          <Wide>
            <FirstBandContainer>
              Find The Right Words!{false && <div>WISH&nbsp;IT?  TEXT&nbsp;IT!</div>}
            </FirstBandContainer>
            <LineContainer darkmode={darkMode ? "true" : "false"} />
            <ModeSwitch>
              <Button color={"inherit"} onClick={() => {
                setDarkMode(!darkMode);
                setModeIsSet(true);
                updateSession2({ mode: !darkMode, modeIsSet: true });
              }}>
                {darkMode ? <LightModeTwoToneIcon /> : <ModeNightTwoToneIcon />}
              </Button>
            </ModeSwitch>
          </Wide>
          <Container maxWidth="sm"><br />
            {virgin && session.greeting ?
              <ActionContainer>
                <ClearButton
                  onClick={async () => {
                    updateRoute({
                      from: '',
                      to: '',
                      occasion: '',
                      naive: false,
                      reflections: '',
                      instructions: '',
                      inastyleof: '',
                      language: '',
                      interests: '',

                    })
                    const card: CardData = {
                      num: 0,
                      image: emptyImage,
                      signature: '',
                      linkid: ''
                    }
                    //setNewCard(card);
                    setGreeting('');
                    setImage(emptyImage);
                    setSignature('');
                    setLinkid('');
                    setNewCardsStack([]);
                    setCardMax(0);
                    setCardNum(0);
                    await deleteSessionCards(session.sessionid);
                    await deleteSessionImages(session.sessionid);
                    // if (image?.url)
                    //  updateSession2({ cardMax:cm, cardNum:cn,hasNewCard:false,currentCardString: JSON.stringify(card),newCardString: JSON.stringify(card) });
                    console.log("clear all", session.sessionid)
                    updateSession2({
                      from: '',
                      to: '',
                      occasion: '',
                      virgin: false,
                      prompt1: false,
                      prompt2: false,
                      prompt3: false,
                      prompt4: false,
                      prompt5: false,
                      prompt6: false,
                      naive: false,
                      reflections: '',
                      instructions: '',
                      inastyleof: '',
                      language: '',
                      interests: '',
                      greeting: '',
                      image: emptyImage,
                      signature: '',
                      linkid: '',

                      giftSuggestions: '',
                      imagesString: '',
                      selectedImage: '',
                      currentCardString: '',
                      num: 1,
                      max: 1,
                      cardNum: 1,
                      cardMax: 1,

                      hasNewCard: true,
                      card: false,
                      newCardsStackString: '',

                    });
                    setFrom('');
                    setTo('');
                    setOccasion('');
                    setVirgin(false);
                    setVirgin2(false);
                    setPrompt1(false);
                    setPrompt2(false);
                    setPrompt3(false);
                    setPrompt4(false);
                    setPrompt5(false);
                    setPrompt6(false);
                    setNaive(false);
                    setReflections('');
                    setInstructions('');
                    setInastyleof('');
                    setLanguage('');
                    setInterests('');
                    setNum(1);
                    setMax(1);
                    setCard(false);
                    deleteSessionHistories(session.sessionid);
                  }}>
                  <ClearIcon />
                  <ClearText>Reset Session</ClearText>
                </ClearButton>
              </ActionContainer> : null}
            {!prompt1 ?
              <Box sx={{ mt: 0, width: 1, }}>
                <Starter>
                  <LooksOneOutlinedIcon fontSize="inherit" color='success' />
                  <StarterMessage>
                    <Typography fontSize="inherit" color="secondary"/*color="#ffee58"*/>To begin, select or type an occasion for the greeting, for example &ldquo;Birthday&ldquo;:</Typography>
                  </StarterMessage>
                </Starter>
              </Box>
              : null}
            <Combo id="occasion"
              label="Occasion"
              value={occasion}
              error={missingOccasion}
              onChange={onOccasionChange}
              helperText="Required for a meaningful result. For example: &ldquo;8th Birthday for a boy&rdquo;, &ldquo;Sweet Sixteen&rdquo;, &ldquo;Illness&rdquo; &ldquo;Death in the family&rdquo;, &ldquo;Christmas&rdquo;, &ldquo;Graduation&ldquo;"
            />
            <Box sx={{ mb: 4, color: 'primary', justifyContent: 'flex-end' }}>
              <FormControlLabel
                label={<Typography style={{ color: theme.palette.text.secondary }}>Keep it light-hearted, if possible, with emojis.</Typography>}
                control={
                  <Checkbox
                    sx={{ color: 'secondary' }}
                    checked={!naive}
                    onChange={onNaiveChange}
                  />
                }
              />
            </Box>
            {false && session.greeting && !prompt3 ?
              <Box sx={{ mt: 10, width: 1 }}>
                <Starter onClick={() => setPrompt3(true)}>
                  <ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
                  <StarterMessage>
                    <Typography fontSize="inherit" color="secondary"/*color="#ffee58"*/>Experiment with advanced inputs to replace the defaults with more specific instructions to AI:
                    </Typography>
                  </StarterMessage>
                </Starter>
              </Box>
              : null}

            {false && virgin && session.greeting ?
              <Accordion style={{ borderRadius: 14 }} sx={{ mt: 5, background: theme.palette.background.default }} expanded={expanded === 'custom'} onChange={handleAccordeonChange('custom')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>Customize</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ borderRadius: 14 }}>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="to"
                      label="To (Recepient)"
                      value={to}
                      onChange={onToChange}
                      helperText="Examples: &ldquo;Our nephew Billy&rdquo;, &ldquo;My Grandson Evan&rdquo;, &ldquo;My Love&rdquo; &ldquo;Love of My Life&rdquo;, &ldquo;Simpsons&rdquo;, &ldquo;Mr Williams, the postman.&ldquo;"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="from"
                      label="From"
                      value={from}
                      onChange={onFromChange}
                      helperText="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."
                    />
                  </Box>
                </AccordionDetails>
              </Accordion> : null}

            {virgin && session.greeting ?
              <Accordion sx={{ my: 5 }} expanded={expanded === 'advanced'} onChange={handleAccordeonChange('advanced')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>Advanced Inputs</Typography>
                </AccordionSummary>
                <AccordionDetails >
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="to"
                      label="To (Recepient)"
                      value={to}
                      onChange={onToChange}
                      helperText="Examples: &ldquo;Our nephew Billy&rdquo;, &ldquo;My Grandson Evan&rdquo;, &ldquo;My Love&rdquo; &ldquo;Love of My Life&rdquo;, &ldquo;Simpsons&rdquo;, &ldquo;Mr Williams, the postman.&ldquo;"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="from"
                      label="From"
                      value={from}
                      onChange={onFromChange}
                      helperText="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="reflections"
                      label="Additional Reflections,Thoughts"
                      value={reflections}
                      onChange={onReflectionsChange}
                      helperText="Any thoughts that you have about what should be reflected in the greeting. For example: 'Always thinking of you', 'We miss you', 'We are so proud of you', 'We are so happy for you', 'We are so sorry for your loss', 'Say Hi to your family'"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="instructions"
                      label="Instructions to AI"
                      value={instructions}
                      onChange={onInstructionsChange}
                      helperText="Example: 'Keep it very short', 'Create a headline and plenty of emoticons', 'Do not wish cake', ' As a methodist prayer', 'As a Hebrew prayer', 'No special day'"
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="inastyleof"
                      label="Use AI to write in the style of"
                      value={inastyleof}
                      onChange={onInastyleofChange}
                      helperText="Example: 'Mark Twain'.'Dr Seuss', 'Shakespeare', 'King David', 'The Simpsons', 'The Bible'. You can upload an image of a character or a person to go with the styled greeting."
                    />
                  </Box>
                  <Box sx={{ my: 4 }}>
                    <TextField
                      sx={{ width: { xs: 1 } }}
                      id="language"
                      label="Language"
                      value={language}
                      onChange={onLanguageChange}
                      helperText="Example: 'French', 'Ukrainian', 'Middle-English', 'Canadian'"
                    />
                  </Box>
                </AccordionDetails>
              </Accordion> : null}
            {!prompt2 && occasion ?
              <Box sx={{ mt: 10, width: 1 }}>
                <Starter><LooksTwoOutlinedIcon fontSize="inherit" color='success' />
                  <StarterMessage><Typography fontSize="inherit" color="secondary"/*color="#ffee58"*/>Click or tap on the &quot;Suggest Wish Text&quot; button:</Typography></StarterMessage></Starter>
              </Box>
              : null}
            <GreetingOutput darkMode={darkMode} sharedImages={sharedImages} PlayerToolbar={OutputPlayerToolbar} setNum={setNum} setMax={setMax} max={max} num={num} setPrompt4={setPrompt4} setPrompt5={setPrompt5} prompt4={prompt4} prompt5={prompt5} prompt6={prompt6} setPrompt6={setPrompt6} onVirgin={async () => {
              await recordEvent(session.sessionid, 'virgin wish-text request', `occasion:${occasion}`);
              setVirgin(true);
              setPrompt2(true);
              setSelectedOccasion(occasion);
              updateSession2({ virgin: true, prompt2: true });
            }} greeting={session.greeting || ''} onVirgin2={async () => {
              await recordEvent(session.sessionid, 'virgin2 request', `occasion:${occasion}`);
              setVirgin2(true);
              setPrompt4(true);
              updateSession2({ virgin2: true, prompt4: true });
            }} virgin={virgin} virgin2={virgin2} setMissingOccasion={setMissingOccasion} setLoadReady={setLoadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} naive={naive} reflections={reflections} instructions={instructions} inastyleof={inastyleof} language={language} /*authSession={authSession}*/ />


          </Container>
          <Container maxWidth="sm" sx={{ mt: 10 }}>
            {session.greeting && !session.card && <Box sx={{ mt: 1, width: 1 }}>
              <OvalButton fullWidth size="small" variant="contained" onClick={() => {
                updateSession2({ card: true });
                setCard(true);
                updateRoute({
                  from,
                  to,
                  occasion,
                  naive,
                  reflections,
                  instructions,
                  inastyleof,
                  language,
                  interests,
                  card: true
                })
              }}>Open Greeting Card Composer</OvalButton>
            </Box>}
            {session.card && <Box sx={{ mt: 1, width: 1 }}>
              <OvalButton fullWidth size="small" variant="contained" onClick={() => {
                updateSession2({ card: false });
                setCard(false);
                updateRoute({
                  from,
                  to,
                  occasion,
                  naive,
                  reflections,
                  instructions,
                  inastyleof,
                  language,
                  interests,
                  card: true
                })
              }}>Close Greeting Card Composer</OvalButton>
            </Box>
            }

            {session.greeting && session.card &&

              <Box sx={{ my: 1 }}>

                <GreetingCard
                  greeting={greeting}
                  num={num}
                  image={image}
                  signature={signature}
                  linkid={linkid}

                  setImage={setImage}
                  setSignature={setSignature}
                  setLinkid={setLinkid}

                  newCardsStack={newCardsStack}
                  setNewCardsStack={setNewCardsStack}
                  setPromptImageStrip={setPromptImageStrip}
                  promptImageStrip={promptImageStrip}

                  setCardNum={setCardNum}
                  setCardMax={setCardMax}
                  setNumPointer={setNumPointer}
                  cardNum={cardNum}
                  cardMax={cardMax}
                  startOpen={true}
                  darkMode={darkMode || false}
                  sessionid={session.sessionid || ''}
                  fbclid={fbclid}
                  utm_content={utm_content}
                  sharedImages={sharedImages}

                  loading={false}
                  max={max}
                  images={images}
                  setImages={setImages}
                  setPrompt5={setPrompt5} prompt4={prompt4} prompt5={prompt5} prompt6={prompt6} setPrompt6={setPrompt6}
                  onVirgin={async () => {
                    await recordEvent(session.sessionid, 'virgin wish-text request', `occasion:${occasion}`);
                    setVirgin(true);
                    setPrompt2(true);
                    setSelectedOccasion(occasion);
                    updateSession2({ virgin: true, prompt2: true });
                  }}

                  onVirgin2={async () => {
                    await recordEvent(session.sessionid, 'virgin2 request', `occasion:${occasion}`);
                    setVirgin2(true);
                    setPrompt4(true);
                    updateSession2({ virgin2: true, prompt4: true });
                  }}
                  virgin={virgin} virgin2={virgin2}
                  setLoadReady={setLoadReady}
                  session={session}
                  updateSession2={updateSession2}  /*authSession={authSession}*/ />
              </Box>

            }

          </Container>

          <Container maxWidth="md">
            {session.greeting && <GiftsOutput loadReady={loadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={selectedOccasion} reflections={reflections} interests={interests} onInterestsChange={onInterestsChange} />}
            </Container>
        
        

          <Footer darkmode={darkMode ? "true" : "false"}>
            {!virgin && !prompt1 && <Copyright>

              <Sub>
                <Typography variant="caption" gutterBottom>Create the &quot;wishing&quot; or greeting text for you to paste into your favorite messaging app.
                  AI will provide the helpful suggestions that you can edit by clicking on the suggestion.

                  Additionally, Wish Text Composer can generate a &apos;postcard&apos; greeting over an uploaded image. You can download the card and share from any device.
                  Utilizing AI, it also provides the gift suggestions.
                </Typography>
              </Sub>
            </Copyright>

            }


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


          <div className="container">
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
        </main>

      </ThemeProvider>
    </>
  )
}
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
      let { linkid, card, signature, dark, num, max, cardNum, cardMax, prompt1, prompt2, prompt3, prompt4, prompt5, prompt6, promptImageStrip, fbclid, utm_medium, utm_campaign, utm_content, virgin, virgin2, from, to, occasion, naive, reflections, instructions, inastyleof, language, age, interests, sex }:
        { linkid: string, card: boolean, signature: string, dark: boolean, num: number, max: number, cardNum: number, cardMax: number, prompt1: string, prompt2: string, prompt3: string, prompt4: string, prompt5: string, prompt6: string, fbclid: string, utm_medium: string, utm_campaign: string, utm_content: string, virgin: boolean, virgin2: boolean, from: string, to: string, occasion: string, naive: boolean, reflections: string, instructions: string, inastyleof: string, language: string, age: string, interests: string, sex: string, promptImageStrip: boolean } = context.query as any;

      linkid = linkid || '';
      from = from || '';
      to = to || '';
      occasion = occasion || '';
      age = age || '';
      interests = interests || '';
      sex = sex || '';
      virgin = virgin || false;
      virgin2 = virgin2 || false;
      signature = signature || '';

      prompt1 = prompt1 || '';
      prompt2 = prompt2 || '';
      prompt3 = prompt3 || '';
      prompt4 = prompt4 || '';
      prompt5 = prompt5 || '';
      prompt6 = prompt6 || '';
      promptImageStrip = promptImageStrip || false;
      //  console.log("SSR SESSION",num,max)
      //num = num || 1;
      //max = max || 1;
      dark = dark || false;
      naive = naive || false;
      reflections = reflections || '';
      instructions = instructions || '';
      inastyleof = inastyleof || '';
      language = language || '';
      utm_medium = utm_medium || '';
      utm_campaign = utm_campaign || '';
      utm_content = utm_content || '';
      fbclid = fbclid || '';
      card = card || false;
      //console.log("naive1=", naive)
      var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      let sessionid = context.req.session?.sessionid || randomstring();
      let startoptions: Options | null = null;// = await fetchSession(sessionid);
      let sharedImages: ImageData[] | null = null;// = await fetchSharedImages();
      let images: ImageData[] | null = null;//=await fetchSessionImages();

      try {
        let startoptions2: Options | null = null;
        let sharedImages2: ImageData[] | null = null;
        let imagesData: { success: boolean, images: ImageData[] } | null = null;
        [startoptions2, sharedImages2, imagesData] = await Promise.all([
          fetchSession(sessionid),
          fetchSharedImages(),
          fetchSessionImages(sessionid),
        ]);
        startoptions = startoptions2;
        sharedImages = sharedImages2;
        images = imagesData.success ? imagesData.images : [];
        //  console.log("Start Options:", startoptions);
        //  console.log("Shared Images:", sharedImages);
        //  console.log("Images:", images);

        //  console.log("All fetch operations completed!");
      } catch (error) {
        console.error("Error occurred:", error);
      }

      startoptions = startoptions || {
        sessionid,
        noExplain: false,
        currentCardString: '',
        newCardStackString: '',
      } as Options;
      //console.log("startSession=", startoptions)
      const ua = context.req.headers['user-agent'];
      const botInfo = isbot({ ua });
      if (!botInfo.bot && !context.req.session.sessionid) {
        try {
          await recordEvent(sessionid, 'ssr-index-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
        }
        catch (e) {
          console.log("record event error", e)
        }
      }
      if (botInfo.bot && !context.req.session.sessionid) {
        try {
          await recordEvent(sessionid, 'ssr-bot-index-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
        }
        catch (e) {
          console.log("record event error", e);
        }
      }

      // if (botInfo.bot)
      //   setTimeout(async () => await recordEvent(sessionid, 'bot', `{ua:${ua},utm_medium:${utm_medium},utm_campaign:${utm_campaign},utm_content:${utm_content}}`), 100);

      if (context.req.session.sessionid != sessionid) {
        context.req.session.sessionid = sessionid;
        //await context.req.session.save();
        try {
          //console.log("session save")
          await context.req.session.save();
        }
        catch (e) {
          console.log("session save error", e)
        }
      }
      let options: Options = startoptions;

      from = from || options.from || '';
      to = to || options.to || '';
      occasion = occasion || options.occasion || '';
      virgin = options.virgin || false;
      virgin2 = options.virgin2 || false;
      signature = signature || options.signature || '';
      prompt1 = prompt1 || options.prompt1 || '';
      prompt2 = prompt2 || options.prompt2 || '';
      prompt3 = prompt3 || options.prompt3 || '';
      prompt4 = prompt4 || options.prompt4 || '';
      prompt5 = prompt5 || options.prompt5 || '';

      promptImageStrip = promptImageStrip || options.promptImageStrip || false;
      num = num || options.num || 1;
      max = max || options.max || 1;
      cardNum = cardNum || options.cardNum || 0;
      cardMax = cardMax || options.cardMax || 0;

      naive = naive || options.naive || false;
      reflections = reflections || options.reflections || '';
      instructions = instructions || options.instructions || '';
      inastyleof = inastyleof || options.inastyleof || '';
      language = language || options.language || '';
      interests = interests || options.interests || '';

      linkid = linkid || options.linkid || '';
      //console.log("dark=", dark)
      // console.log("SSR return max=",max)
      return {
        props: {
          from: from,
          to: to,
          occasion: occasion,
          virgin: virgin,
          virgin2: virgin2,
          dark: dark,
          signature: signature,
          prompt1: prompt1,
          prompt2: prompt2,
          prompt3: prompt3,
          prompt4: prompt4,
          prompt5: prompt5,
          promptImageStrip: promptImageStrip,

          num: num,
          max: max,
          cardNum: cardNum,
          cardMax: cardMax,
          card,
          naive: naive,
          reflections: reflections,
          instructions: instructions,
          inastyleof: inastyleof,
          language: language,
          age: age,
          interests: interests,
          sex: sex,
          ironsession: options,
          isbot: botInfo.bot,
          isfb: botInfo.fb || utm_medium ? 1 : 0,
          utm_medium: `{"fbclid":"${fbclid}","utm_content":"${utm_content}"}`,
          sharedImages,
          linkid,
          images
        }
      }
    } catch (x) {
      console.log("FETCH STATIC PROPS ERROR", x);
      context.res.statusCode = 503;
      return {
        props: { error: 503 }
      }
    }
  })
/**
 * 
 * 
 *   {false && authSession && <Box key="login" >
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  aria-haspopup="true"
                >
                  <AvatarMenu authSession={authSession as any} />
                </IconButton>
              </Box>}
 */