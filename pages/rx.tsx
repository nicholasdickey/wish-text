import * as React from 'react';
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
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { useState, useCallback, useEffect } from "react"
import { useRouter } from 'next/router'
import { getReport,getSharedCard, fetchSession, recordEvent, updateSession, deleteSessionHistories, getSessionHistory } from '../lib/api'
import styled from 'styled-components';
import Script from 'next/script'


import {
  GetServerSidePropsContext,
} from "next";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head'
import { blueGrey } from '@mui/material/colors'
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Image from 'next/image'
//import { useSession, signIn, signOut } from "next-auth/react"
import { Roboto } from 'next/font/google';
import { AnyPtrRecord } from 'dns';
import Paper from '@mui/material/Paper';


const ReportItem= function(name:string,expanded:string,setExpanded:any,sessionid:string,reportItem:any){
    const items=reportItem.items.map((record:any,i:number)=>{
        const {name:eventName,image='',occasion,naive='',text='',params='',fbclid='',ad='',stamp='',signature='',greeting='',metaimage=''}=record;
        console.log("ReportItem",record,greeting,name)

        return (
           <Paper sx={{background:"grey",m:2,p:2,color:"white"}} key={`keyasp-${i}`}>
                <Typography>Name: {eventName}</Typography>
                {occasion&&<Typography>Occasion:{occasion}</Typography>}
                {naive&&<div>Naive:{naive}</div>}
                {text&&<div>Text:{text}</div>}
                {params&&<Typography>Params{params}</Typography>}
                {fbclid&&<Typography>fbclid:{fbclid}</Typography>}
                {ad&&<Typography>ad:{ad}</Typography>}
                {stamp&&<Typography>stamp:{stamp}</Typography>}
                {signature&&<div>Signature:{signature}</div>}
                {greeting&&<div>Greeting:{greeting}</div>}
               
                {image&&<img width={128} height={128} src={image} alt={"Image"}/>}
                 {metaimage&&<img width={64*8} height={64*3} src={metaimage} alt={"Image"}/>}
                

                
           </Paper>
        )
        });

  
    return <Accordion key={name} style={{ borderRadius: 14 }} sx={{ mt: 5 }} expanded={expanded == sessionid} onChange={()=>setExpanded(sessionid)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>{name}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ borderRadius: 14 }}>
                  <Box sx={{ my: 4 }}>
                    {items}
                  </Box>
                </AccordionDetails>
              </Accordion>
}

const ModeSwitch = styled.div`
  position:absolute;
  right:200px;
  top:20px;  
  z-index:100; 
 // color:white; 
 
  @media (max-width: 700px) {
    top:0px;
    right:0px;
    font-size:3rem;;
    min-height: 120px;
  }
  `;

const Create = styled.div`
position:absolute;
left:200px;
top:20px;  
z-index:100; 
// color:white; 

@media (max-width: 700px) {
  top:0px;
  left:0px;
  font-size:3rem;;
  min-height: 120px;
}
`;
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
  margin:2px;
`;


interface FooterProps {
  darkmode: string;
};
const Footer = styled.div<FooterProps>`
    padding:1rem 1rem;
    width:100%;
    color:rgb(44, 46, 56);
    //background-color: ${({ darkmode }) => darkmode == "true" ? '#252330' : 'rgb(232, 236, 239)'};
    @media (max-width:990px){
        padding:2px;
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
  min-height:450px;

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
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/wide-candles.jpg'); /* Replace with your image URL */
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
const Wide = styled.div`
   position:relative;
   height:100px;
   width:100%; 

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


const Body = styled.div`
position:relative;
  width:100%;
  height:100%;
 //min-height:100vh;
  padding-top:1vh;
  
`;
const CardWrap = styled.div`

//padding-top:40%;
    display:flex;
    flex-direction:column;
    justify-content: center;
    @media (max-width: 900px) {
        padding-top:5px;
    }

`;
const Wrap = styled.div`
    //position:absolute;
    //bottom:0px;
    width:100%;
  
   
    display: flex;
   // height:100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
`
const OuterWrapper = styled.div`
    position:relative;
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content: space-between;
    `;

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v = false;
export default function Report({ report}:
  { report:any}) {


  const router = useRouter();
  const matches = useMediaQuery('(min-height:600px)');
const [expanded,setExpanded]=React.useState<string>("");
  const canvasRef = React.useRef<HTMLDivElement>(null);
  let theme: any;
  let itemsAll:any[]=[];
  for (const key in report){
    const item=report[key];
    const {sessionid,items}=item
    itemsAll.push(ReportItem(`Session ${sessionid},items:${item.items.length}`,expanded,setExpanded,sessionid,item))
  };


  return (
    <>
      <Head>
        <title>A Report</title>
       
        <meta name="viewport" content="width=device-width" />
      
      </Head>
       <main className={roboto.className} >
          <div>
            <CssBaseline />
          </div>
            <Script src={`https://www.googletagmanager.com/gtag/js?${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
            <Script id="google-analytics">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
            </Script>
         
          {itemsAll}

        
        </main>

     
    </>
  )
}
export const getServerSideProps =
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
  
 
      const data = await getReport();
      let report:any=null;
      if (data?.success) {
        report = data.report;
      }

     
      return {
        props: {
            report
        }
      }
    } catch (x) {
      console.log("FETCH SSR PROPS ERROR", x);
      context.res.statusCode = 503;
      return {
        props: { error: 503 }
      }
    }
  }
