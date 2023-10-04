import * as React from 'react';

import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { getSharedCard, fetchSession, recordEvent, updateSession, deleteSessionHistories, getSessionHistory } from '../../lib/api'
import Script from 'next/script'
import ReactMarkdown from "react-markdown";
import CardData from "../../lib/card-data";
import ImageData from "../../lib/image-data";
import { headers } from 'next/headers';
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
import { withSessionSsr, Options } from '../../lib/with-session';
import { isbot } from '../../lib/isbot';

export default function Home({ id, card }:
    { id: string, card: CardData }) {
    console.log("Home");

    const { signature, greeting, image } = card;
    const text = (greeting || "").replaceAll('\n\n', '\n');
	const parsedText=JSON.parse(text);
	console.log("parsedText",parsedText);
	const {headline,body}=parsedText;
	/*
    const tw = text.split('\n');
    const headline = tw.length > 1 ? tw[0] : '';
    const body = tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
	*/
    const systemMode = true;
	console.log("input",{headline,body,signature,text,greeting})
    const html = `
    <main class="gsap-container">
		<div id="wt-body" class="body">
			<div class="inner-div">
		
			<div class="left-panel">	
					<div class="front">
						<img src="${image.url}" class="gsap-image"/>
					</div>
					<div class="back">
						<img src="${image.url}" class="gsap-image"/>
					</div>
				</div>
				<div class="right-panel">	
				<div class="inner-container">
					<div class="gsap-headline">
						${headline}
					</div>
						<div class="gsap-body">
							${body}
						</div>
					
					<div class="gsap-signature">
						${signature}
					</div>
				</div>
				<div class="footer-container">
					<div class="gsap-footer">
						${"www.wish-text.com"}
						
					</div>
					
				</div>
			</div>
		</div>	
	
</main>
  <head>    
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vara@1.4.0/lib/vara.min.js" type="text/javascript"></script>
  <link rel="stylesheet" href="/gasp/gasp.css">  
  <script
  src="https://code.jquery.com/jquery-3.7.1.js"
  integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
  crossorigin="anonymous"></script>
  <script src="/gasp/gasp.js"></script>
 
  </head>    
    `;
    return <div dangerouslySetInnerHTML={{ __html: html }} />
    /*   return (
           <>
               <Head>
                   <title>GASP Card Renderer</title>
                   <link rel="icon" href={systemMode ? "/wbLogo.png" : "/bwLogo.png"} sizes="64x63" type="image/png" />
                   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
                </Head>
             
           </>
       )*/
}
export const getServerSideProps = withSessionSsr(
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {

            let { fbclid, utm_content, dark, create = false }:
                { fbclid: string, utm_content: string, dark: boolean, create: boolean } = context.query as any;

            let id: string = (context.params?.id || '') as string;
            // const contentType = context.req.headers['content-type'];
            const acceptHeader = context.req.headers['accept'];

            // Check if the request accepts HTML (full page load)
            const isFullPageLoad = acceptHeader && acceptHeader.includes('text/html');

            if (!isFullPageLoad) {

                const link = id;

                const linkid: string = link.split(".")[0];
                const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/get-metaimage?linkid=${linkid}`;
                console.log("embedded image:", url);
                const result = await axios.get(url);
                const { success, msg, metaimage } = result.data;
                console.log("image gif", { linkid, success });

                var img = new Buffer(metaimage.split(',')[1], 'base64');
                // console.log("metaimage:::::::::::::::::::::::::::::::::::::::::",metaimage);
                //console.log("image >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",img.length,img);
                context.res.writeHead(200, {
                    'Content-Type': 'image/gif',
                    'Content-Length': img.length
                });
                context.res.end(img);
                console.log("embedded image sent");
                return { props: {} };
            }
            let isGif = false;
            if (id.indexOf('.gif') > 0) {
                isGif = true;
                id = id.replace('.gif', '');
            }

            utm_content = utm_content || '';
            dark = dark || false;
            fbclid = fbclid || '';
         //   console.log("!!!!!!!!!!!!!!!!!!!!!!")
            const emptyImage: ImageData = {
                url: '',
                publicId: '',
                height: 0,
                width: 0,
                thumbnailUrl: '',
                original_filename: ''
            };
            const ua = context.req.headers['user-agent'];
            const botInfo = isbot({ ua });

            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            let sessionid = context.req.session?.sessionid || randomstring();
            const data = await getSharedCard(sessionid, id);
            let card: CardData = { signature: '', greeting: '', image: emptyImage, metaimage: '' };
            if (data?.success) {
                card = data.card;
            }

         

        
            return {
                props: {
                    id,
                    card,
                }
            }
        } catch (x) {
            console.log("FETCH SSR PROPS ERROR", x);
            context.res.statusCode = 503;
            return {
                props: { error: 503 }
            }
        }
    })
/**
 * 
 * gsap-video-export https://codepen.io/cassie-codes/pen/VweQjBw -S svg -z 2 -v 1080x1080
 *  gsap-video-export https://dev.qwiket.com/preview/7zphndzr25hfquwbb1mu48 -S svg -z 2 -v 1080x1080
 * 
 * 
 * ffmpeg -y -i video.mp4 -vf "fps=30,scale=1080:1080:flags=lanczos,palettegen" palette.png
 * 
 * ffmpeg -y -i video.mp4 -i palette.png -filter_complex "fps=30,scale=1080:1080:flags=lanczos[x];[x][1:v]paletteuse" video.gif
 * 
 * 
 */