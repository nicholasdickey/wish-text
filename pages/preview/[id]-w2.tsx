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
    const tw = text.split('\n');
    const headline = tw.length > 1 ? tw[0] : '';
    const body = tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
    const systemMode = true;
    const html = `
   
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="120 50 330 200" aria-labelledby="title" role="img">
	<title id="title">viewBox</title>
	<defs>
		<clipPath id="line-mask-t">
			<rect class="line-mask-t" width="96.59" height="96.59" x="202.95" y="101.53" />
		</clipPath>
		<clipPath id="line-mask-b">
			<rect class="line-mask-b " width="96.59" height="96.59" x="210.26" y="108.63" />
		</clipPath>

		<clipPath id="w4">
			<path d="M332.2,143a4.5,4.5,0,0,0-4.72,4.5,4.91,4.91,0,0,0,1.07,3,5.59,5.59,0,0,1,2.75-.69c2.44,0,4.45,1.29,4.45,3.77,0,3.91-6.17,10-10.93,10a1.55,1.55,0,0,1-.31,0h0a5,5,0,0,1,1.07.74c7.16-2.28,12-8.37,12-15.62C337.55,145.52,335.58,143,332.2,143Z" />
		</clipPath>

		<clipPath id="v2">
			<path d="M250.5,143a4.5,4.5,0,0,0-4.72,4.5,4.91,4.91,0,0,0,1.07,3,5.61,5.61,0,0,1,2.75-.69c2.44,0,4.46,1.29,4.46,3.77,0,3.91-6.18,10-10.93,10a1.58,1.58,0,0,1-.32,0h0a5.17,5.17,0,0,1,1.06.74c7.16-2.28,12-8.37,12-15.62C255.86,145.52,253.88,143,250.5,143Z" />
		</clipPath>

		<clipPath id="i2">
			<path d="M268.24,161.33a9,9,0,0,0-.12,1.16c0,.64.34,1,.85,1a2.29,2.29,0,0,0,1.2-.39l.17.3a11.08,11.08,0,0,1-6.47,1.84c-1.93,0-4.84-.6-5-4.11a8.46,8.46,0,0,1,.09-1.46l1.62-11.7a6.8,6.8,0,0,0,.09-.86c0-1.2-.64-1.63-2-1.63l-.13-.38a39.93,39.93,0,0,0,12.3-2.14Z" />
		</clipPath>

		<clipPath id="i1">
			<path d="M261.86,138c0-2.65,1.88-4.8,5.53-4.8,3,0,4.41,1.59,4.41,3.69,0,2.61-1.93,4.67-5.57,4.67C263.23,141.53,261.86,140,261.86,138Z" />
		</clipPath>

		<clipPath id="v1">
			<path d="M245.53,163.65c-.91,0-1.58-.09-2.36-.09s-1.46-1.05-1.46-2a13.7,13.7,0,0,1,.17-1.8l1.55-11.27a9.25,9.25,0,0,0,.08-1.46c-.13-3.51-3-4.11-5-4.11a11.08,11.08,0,0,0-6.47,1.84l.17.3a2.29,2.29,0,0,1,1.2-.39c.47,0,.86.35.86,1,0,1.63-1.46,10.67-1.46,10.67a30.33,30.33,0,0,0-.52,4.89c0,2.53,2.23,4.3,5.28,4.3A19.17,19.17,0,0,0,245.53,163.65Z" />
		</clipPath>

		<clipPath id="w1">
			<path d="M309.85,163.35l-.42-1.76a4.17,4.17,0,0,1,0-1.73l1.47-11.34a8.23,8.23,0,0,0,.09-1.46c-.13-3.51-3-4.11-5-4.11a11.13,11.13,0,0,0-6.48,1.84l.18.3a2.27,2.27,0,0,1,1.2-.39c.47,0,.85.35.85,1,0,1.63-1.45,10.67-1.45,10.67a30.33,30.33,0,0,0-.52,4.89c0,2.53.95,4.83,5.19,4.13C308.86,164.71,309.85,163.35,309.85,163.35Z" />
		</clipPath>

		<clipPath id="w3">
			<path d="M326.88,163.83c.05-.5-1.28-.34-2.1-.27s-1.3-1.05-1.3-2a12.2,12.2,0,0,1,.18-1.8l1.54-11.27a9.25,9.25,0,0,0,.08-1.46c-.12-3.51-3-4.11-5-4.11a11.93,11.93,0,0,0-6.62,1.84l.23.39a2.69,2.69,0,0,1,1.29-.39c.47,0,.78.26.78.94,0,1.63-1.61,10.67-1.61,10.67a30.51,30.51,0,0,0-.54,4.89c0,2.53,2.49,4.3,5.53,4.3A17,17,0,0,0,326.88,163.83Z" />
		</clipPath>

		<clipPath id="w2">
			<path d="M315.41,150.37c-1.11,5.24-3.54,11.6-5.49,11.6a.72.72,0,0,1-.48-.33,4.3,4.3,0,0,0,.31,1.83c1.76-1.45,3.59-4.16,4.9-8.55C314.85,153.74,315.15,152,315.41,150.37Z" />
		</clipPath>

		<clipPath id="e1">
			<path d="M294.56,161a10,10,0,0,1-5.74,1.88c-3.56,0-5.4-2.65-5.4-7a14.06,14.06,0,0,1,.12-1.93,14.89,14.89,0,0,1,.22-1.49h0c1-5.48,3.23-8.47,4.64-9h0l.92-.39a4.12,4.12,0,0,0-.51,0c-8.92,0-15.52,6-15.52,13.15,0,5.49,3.65,9.13,10.89,9.13,4.5,0,8.1-1.37,10.54-4.07Z" />
		</clipPath>

		<clipPath id="e2">
			<path d="M288.82,143c-.5.05-.8.34-.55.34h.55c.64,0,1.16.6,1.16,2.1,0,3.56-3.3,7.76-6.39,8.06-.46,0-.45.14,0,.34a44.8,44.8,0,0,0,4.63.48c6.64,0,9.34-2.92,9.34-5.75S294.69,143,288.82,143Z" />
		</clipPath>

		<clipPath id="b1">
			<path d="M353.91,164l-.22,0-.15,0a1.61,1.61,0,0,1-1.61-.88,3.8,3.8,0,0,1-.27-2.35c0-.52,1.23-8.43,1.23-8.45v-.11l.06-.4c0-.26.08-.6.14-1v-.07c.1-.69.23-1.58.36-2.57h0l2-12.56a2.91,2.91,0,0,1,1.69-.56v-.56s-5.3.09-6.76.09c-4.46,0-8.23-.13-8.23-.13l0,.43c2.18,0,3.08.77,2.66,3.82l-2.79,20c-.47,3.34-1.8,5.36-4,5.36l0,.43s3.77-.13,8.23-.13c2.11,0,4.86.09,7.65.12Z" />
		</clipPath>

		<clipPath id="b2">
			<path d="M353.43,148.09a2.52,2.52,0,0,1-.07.4l5.93-.26h0c6.43-.39,10.76-2.87,10.76-7.63,0-4.29-5.4-6.22-10.59-6.22-2.26,0-2.45,0-2.45,0l.09.56c1.82.32,2.75,2.18,2.75,4.85C359.85,144.35,357.66,148.08,353.43,148.09Z" />
		</clipPath>

		<clipPath id="b3">
			<path d="M359.29,148.06h-5l-.92,0c-.06.4-.06.45-.06.45,4,0,5.28,3.78,5.28,6.65,0,3.84-2,8.62-5.1,8.77,0,.1,0,.4,0,.4l1.86,0c7.2,0,14.06-2.35,14.06-8.83C369.45,151.8,365.72,148.28,359.29,148.06Z" />
		</clipPath>

		<clipPath id="o1">
			<path d="M383.12,164.88h0c-1.16,0-1.89-2.06-1.89-5.66,0-5.51,2.06-15.71,4.21-15.94V143c-8.59.52-14,6.74-14,12.9,0,5.74,4.63,9.34,10.71,9.34.36,0,.67,0,1,0Z" />
		</clipPath>

		<clipPath id="o2">
			<path d="M386.55,143c-.44,0-.86,0-1.27.06v.32a.64.64,0,0,1,.2,0c1.16,0,1.84,2,1.84,5.57,0,5.57-2.06,16-4.24,16h-.17c-.07,0,0,.35,0,.35,8.82-.37,14.31-6.67,14.31-12.91C397.22,146.58,392.59,143,386.55,143Z" />
		</clipPath>

		<clipPath id="x1">
			<path d="M421.62,163.44c-.52,0-1-.39-1.37-1.2l-2.9-6.33-.2-.43-.6-1.26h0l-.41-.89-.23-.5h0l-2.54-5.59c-1.45-3.22-3.81-4.29-7.11-4.29a11.08,11.08,0,0,0-6.47,1.84l.17.3a1.73,1.73,0,0,1,1-.34c.69,0,1.12.77,1.42,1.46l3.09,6.72.54,1.12h0l.28.59h0l2.81,6.05a7.34,7.34,0,0,0,7.24,4.59,11.08,11.08,0,0,0,6.47-1.84l-.17-.3A1.78,1.78,0,0,1,421.62,163.44Z" />
		</clipPath>

		<clipPath id="x2">
			<path d="M403.2,159.09c-1.42,0-2.19-.56-2.19-1.5,0-1.2,1.76-2.91,5-3.6l-.2-.38c-5.57,1.37-7.37,4.54-7.37,7.15a4.23,4.23,0,0,0,4.31,4.56,4,4,0,0,0,4.31-4c0-.05,0,.68,0-.15a3.9,3.9,0,0,0-1.19-2.66,6.77,6.77,0,0,1-1.67.46A6.11,6.11,0,0,1,403.2,159.09Z" />
		</clipPath>

		<clipPath id="x3">
			<path d="M418.83,149.16c1.75,0,2.7.82,2.7,1.84,0,1.29-1.75,2.57-5,3.26l.18.35c5.79-1.2,7.16-4.51,7.16-7.16a4.17,4.17,0,0,0-4.37-4.42,3.88,3.88,0,0,0-4.24,3.82,3.71,3.71,0,0,0,1.2,2.74A7.67,7.67,0,0,1,418.83,149.16Z" />
		</clipPath>

	</defs>
	<path id="path" opacity="0" d="M388.26,111.21s-43.81,74-183.91-7.35c0,0,93.73,92.31,101.54,100.36,31.4-13.06,82.37-44.31,85.73-92.69" fill="none" stroke="#7d77bc" stroke-miterlimit="10" />
	<rect class="square" opacity="0" width="104.77" height="104.77" x="216.19" y="85.21" fill="#b5f4ea" />
	<g class="t-lines" opacity="0" clip-path="url(#line-mask-t)" fill="#686868">
		<g class="l-line">
			<path d="M204.35,115.26c-.2,0-.35-.9-.35-2s.15-2,.35-2,.35.9.35,2S204.54,115.26,204.35,115.26Z" />
			<path d="M204.35,123.38c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,123.38,204.35,123.38Z" />
			<path d="M204.35,131.5c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,131.5,204.35,131.5Z" />
			<path d="M204.35,139.62c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,139.62,204.35,139.62Z" />
			<path d="M204.35,147.74c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,147.74,204.35,147.74Z" />
			<path d="M204.35,155.86c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.9.35,2S204.54,155.86,204.35,155.86Z" />
			<path d="M204.35,164c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,164,204.35,164Z" />
			<path d="M204.35,172.09c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,172.09,204.35,172.09Z" />
			<path d="M204.35,180.21c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,180.21,204.35,180.21Z" />
			<path d="M204.35,188.33c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,188.33,204.35,188.33Z" />
			<path d="M204.35,196.45c-.2,0-.35-.91-.35-2s.15-2,.35-2,.35.91.35,2S204.54,196.45,204.35,196.45Z" />
		</g>
		<g class="t-line">
			<path d="M292.93,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S292.93,104.06,292.93,103.86Z" />
			<path d="M284.81,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S284.81,104.06,284.81,103.86Z" />
			<path d="M276.69,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S276.69,104.06,276.69,103.86Z" />
			<path d="M268.57,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S268.57,104.06,268.57,103.86Z" />
			<path d="M260.46,103.86c0-.19.9-.35,2-.35s2,.16,2,.35-.9.36-2,.36S260.46,104.06,260.46,103.86Z" />
			<path d="M252.34,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S252.34,104.06,252.34,103.86Z" />
			<path d="M244.22,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S244.22,104.06,244.22,103.86Z" />
			<path d="M236.1,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S236.1,104.06,236.1,103.86Z" />
			<path d="M228,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S228,104.06,228,103.86Z" />
			<path d="M219.87,103.86c0-.19.9-.35,2-.35s2,.16,2,.35-.9.36-2,.36S219.87,104.06,219.87,103.86Z" />
			<path d="M211.75,103.86c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S211.75,104.06,211.75,103.86Z" />
		</g>
	</g>
	<g class="b-lines bottom-square" opacity="0" clip-path="url(#line-mask-b)" fill="#686868">
		<g class="r-line">
			<path d="M305.89,147.74c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,147.74,305.89,147.74Z" />
			<path d="M305.89,155.86c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.9.35,2S306.08,155.86,305.89,155.86Z" />
			<path d="M305.89,164c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,164,305.89,164Z" />
			<path d="M305.89,115.26c-.2,0-.36-.9-.36-2s.16-2,.36-2,.35.9.35,2S306.08,115.26,305.89,115.26Z" />
			<path d="M305.89,123.38c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,123.38,305.89,123.38Z" />
			<path d="M305.89,131.5c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,131.5,305.89,131.5Z" />
			<path d="M305.89,139.62c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,139.62,305.89,139.62Z" />
			<path d="M305.89,172.09c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,172.09,305.89,172.09Z" />
			<path d="M305.89,180.21c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,180.21,305.89,180.21Z" />
			<path d="M305.89,188.33c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,188.33,305.89,188.33Z" />
			<path d="M305.89,196.45c-.2,0-.36-.91-.36-2s.16-2,.36-2,.35.91.35,2S306.08,196.45,305.89,196.45Z" />
		</g>
		<g class="b-line">
			<path d="M292.93,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S292.93,204.77,292.93,204.57Z" />
			<path d="M284.81,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S284.81,204.77,284.81,204.57Z" />
			<path d="M276.69,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S276.69,204.77,276.69,204.57Z" />
			<path d="M268.57,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S268.57,204.77,268.57,204.57Z" />
			<path d="M260.46,204.57c0-.19.9-.35,2-.35s2,.16,2,.35-.9.36-2,.36S260.46,204.77,260.46,204.57Z" />
			<path d="M252.34,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S252.34,204.77,252.34,204.57Z" />
			<path d="M244.22,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S244.22,204.77,244.22,204.57Z" />
			<path d="M236.1,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S236.1,204.77,236.1,204.57Z" />
			<path d="M228,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S228,204.77,228,204.57Z" />
			<path d="M219.87,204.57c0-.19.9-.35,2-.35s2,.16,2,.35-.9.36-2,.36S219.87,204.77,219.87,204.57Z" />
			<path d="M211.75,204.57c0-.19.91-.35,2-.35s2,.16,2,.35-.91.36-2,.36S211.75,204.77,211.75,204.57Z" />
		</g>
	</g>

	<g class="boxes" opacity="0" fill="#504f59">
		<rect class="b-r-box box" width="7.34" height="7.34" x="302.21" y="200.55" />
		<rect class="b-l-box box" width="7.34" height="7.34" x="200.68" y="200.55" />
		<rect class="t-l-box" width="7.34" height="7.34" x="200.68" y="100.19" />
		<rect class="t-r-box box" width="7.34" height="7.34" x="301.86" y="100.19" />
	</g>

	<g class="shapes" opacity="0" fill="#504f59">

		<g clip-path="url(#v1)">
			<path class="v1" fill="#f8f7ff" d="M245.53,163.65c-.91,0-1.58-.08-2.36-.08s-1.46-1-1.46-2a13.54,13.54,0,0,1,.17-1.8l1.55-11.28a9.06,9.06,0,0,0,.08-1.45c-.13-3.52-3-4.12-5-4.12a11.08,11.08,0,0,0-6.47,1.84l.17.3a2.37,2.37,0,0,1,1.2-.38c.47,0,.86.34.86,1,0,1.63-1.46,10.67-1.46,10.67a30.1,30.1,0,0,0-.52,4.89c0,2.52,2.23,4.29,5.28,4.29A19.17,19.17,0,0,0,245.53,163.65Z" />
			<path class="v1" d="M245.53,163.65c-.91,0-1.58-.08-2.36-.08s-1.46-1-1.46-2a13.54,13.54,0,0,1,.17-1.8l1.55-11.28a9.06,9.06,0,0,0,.08-1.45c-.13-3.52-3-4.12-5-4.12a11.08,11.08,0,0,0-6.47,1.84l.17.3a2.37,2.37,0,0,1,1.2-.38c.47,0,.86.34.86,1,0,1.63-1.46,10.67-1.46,10.67a30.1,30.1,0,0,0-.52,4.89c0,2.52,2.23,4.29,5.28,4.29A19.17,19.17,0,0,0,245.53,163.65Z" />
		</g>

		<g clip-path="url(#v2)">
			<path class="v2" fill="#f8f7ff" d="M250.5,143a4.5,4.5,0,0,0-4.72,4.5,4.87,4.87,0,0,0,1.07,3,5.61,5.61,0,0,1,2.75-.68c2.44,0,4.46,1.28,4.46,3.77,0,3.9-6.18,10-10.93,10a1.55,1.55,0,0,1-.32,0h0a5.59,5.59,0,0,1,1.06.74c7.16-2.28,12-8.37,12-15.62C255.86,145.52,253.88,143,250.5,143Z" />
			<path class="v2" d="M250.5,143a4.5,4.5,0,0,0-4.72,4.5,4.87,4.87,0,0,0,1.07,3,5.61,5.61,0,0,1,2.75-.68c2.44,0,4.46,1.28,4.46,3.77,0,3.9-6.18,10-10.93,10a1.55,1.55,0,0,1-.32,0h0a5.59,5.59,0,0,1,1.06.74c7.16-2.28,12-8.37,12-15.62C255.86,145.52,253.88,143,250.5,143Z" />
		</g>

		<g clip-path="url(#w4)">
			<path class="w4" fill="#b5f4ea" d="M332.2,143a4.5,4.5,0,0,0-4.72,4.5,4.87,4.87,0,0,0,1.07,3,5.58,5.58,0,0,1,2.75-.68c2.44,0,4.45,1.28,4.45,3.77,0,3.9-6.17,10-10.93,10a1.55,1.55,0,0,1-.31,0h0a5.36,5.36,0,0,1,1.07.74c7.16-2.28,12-8.37,12-15.62C337.55,145.52,335.58,143,332.2,143Z" />
			<path class="w4" d="M332.2,143a4.5,4.5,0,0,0-4.72,4.5,4.87,4.87,0,0,0,1.07,3,5.58,5.58,0,0,1,2.75-.68c2.44,0,4.45,1.28,4.45,3.77,0,3.9-6.17,10-10.93,10a1.55,1.55,0,0,1-.31,0h0a5.36,5.36,0,0,1,1.07.74c7.16-2.28,12-8.37,12-15.62C337.55,145.52,335.58,143,332.2,143Z" />
		</g>

		<g clip-path="url(#i2)">
			<path class="i2" fill="#f8f7ff" d="M268.24,161.34a9,9,0,0,0-.12,1.16c0,.64.34,1,.85,1a2.37,2.37,0,0,0,1.2-.38l.17.3a11.08,11.08,0,0,1-6.47,1.84c-1.93,0-4.84-.6-5-4.12a8.29,8.29,0,0,1,.09-1.45l1.62-11.7a6.8,6.8,0,0,0,.09-.86c0-1.2-.64-1.63-2-1.63l-.13-.39a39.93,39.93,0,0,0,12.3-2.14Z" />
			<path class="i2" d="M268.24,161.34a9,9,0,0,0-.12,1.16c0,.64.34,1,.85,1a2.37,2.37,0,0,0,1.2-.38l.17.3a11.08,11.08,0,0,1-6.47,1.84c-1.93,0-4.84-.6-5-4.12a8.29,8.29,0,0,1,.09-1.45l1.62-11.7a6.8,6.8,0,0,0,.09-.86c0-1.2-.64-1.63-2-1.63l-.13-.39a39.93,39.93,0,0,0,12.3-2.14Z" />
		</g>
		<g clip-path="url(#i1)">
			<path class="i1" fill="#f8f7ff" d="M261.86,138c0-2.66,1.88-4.8,5.53-4.8,3,0,4.41,1.58,4.41,3.68,0,2.62-1.93,4.68-5.57,4.68C263.23,141.54,261.86,140,261.86,138Z" />
			<path class="i1" d="M261.86,138c0-2.66,1.88-4.8,5.53-4.8,3,0,4.41,1.58,4.41,3.68,0,2.62-1.93,4.68-5.57,4.68C263.23,141.54,261.86,140,261.86,138Z" />
		</g>

		<g clip-path="url(#w1)">
			<path class="w1" fill="#f8f7ff" d="M309.85,163.36l-.42-1.76a4.17,4.17,0,0,1,0-1.73l1.47-11.35a8.07,8.07,0,0,0,.09-1.45c-.13-3.52-3-4.12-5-4.12a11.13,11.13,0,0,0-6.48,1.84l.18.3a2.34,2.34,0,0,1,1.2-.38c.47,0,.85.34.85,1,0,1.63-1.45,10.67-1.45,10.67a30.1,30.1,0,0,0-.52,4.89c0,2.52.95,4.83,5.19,4.13C308.86,164.72,309.85,163.36,309.85,163.36Z" />
			<path class="w1" d="M309.85,163.36l-.42-1.76a4.17,4.17,0,0,1,0-1.73l1.47-11.35a8.07,8.07,0,0,0,.09-1.45c-.13-3.52-3-4.12-5-4.12a11.13,11.13,0,0,0-6.48,1.84l.18.3a2.34,2.34,0,0,1,1.2-.38c.47,0,.85.34.85,1,0,1.63-1.45,10.67-1.45,10.67a30.1,30.1,0,0,0-.52,4.89c0,2.52.95,4.83,5.19,4.13C308.86,164.72,309.85,163.36,309.85,163.36Z" />
		</g>
		<g clip-path="url(#w3)">
			<path class="w3" fill="#b5f4ea" d="M326.88,163.83c.05-.5-1.28-.33-2.1-.26s-1.3-1-1.3-2a12.06,12.06,0,0,1,.18-1.8l1.54-11.28a9.06,9.06,0,0,0,.08-1.45c-.12-3.52-3-4.12-5-4.12a11.93,11.93,0,0,0-6.62,1.84l.23.4a2.61,2.61,0,0,1,1.29-.4c.47,0,.78.26.78,1,0,1.63-1.61,10.67-1.61,10.67a30.27,30.27,0,0,0-.54,4.89c0,2.52,2.49,4.29,5.53,4.29A16.81,16.81,0,0,0,326.88,163.83Z" />
			<path class="w3" d="M326.88,163.83c.05-.5-1.28-.33-2.1-.26s-1.3-1-1.3-2a12.06,12.06,0,0,1,.18-1.8l1.54-11.28a9.06,9.06,0,0,0,.08-1.45c-.12-3.52-3-4.12-5-4.12a11.93,11.93,0,0,0-6.62,1.84l.23.4a2.61,2.61,0,0,1,1.29-.4c.47,0,.78.26.78,1,0,1.63-1.61,10.67-1.61,10.67a30.27,30.27,0,0,0-.54,4.89c0,2.52,2.49,4.29,5.53,4.29A16.81,16.81,0,0,0,326.88,163.83Z" />
		</g>
		<g clip-path="url(#w2)">
			<path class="w2" fill="#f8f7ff" d="M315.41,150.38c-1.11,5.24-3.54,11.6-5.49,11.6-.18,0-.37-.19-.48-.34a4.32,4.32,0,0,0,.31,1.84c1.76-1.46,3.59-4.17,4.9-8.56C314.85,153.75,315.15,152,315.41,150.38Z" />
			<path class="w2" d="M315.41,150.38c-1.11,5.24-3.54,11.6-5.49,11.6-.18,0-.37-.19-.48-.34a4.32,4.32,0,0,0,.31,1.84c1.76-1.46,3.59-4.17,4.9-8.56C314.85,153.75,315.15,152,315.41,150.38Z" />
		</g>
		<g clip-path="url(#e1)">
			<path class="e1" fill="#f8f7ff" d="M294.56,161a10,10,0,0,1-5.74,1.89c-3.56,0-5.4-2.66-5.4-7a14.21,14.21,0,0,1,.12-1.94c0-.64.22-1.48.22-1.48h0c1-5.49,3.23-8.48,4.64-9h0l.92-.4a4.12,4.12,0,0,0-.51,0c-8.92,0-15.52,6-15.52,13.16,0,5.49,3.65,9.13,10.89,9.13,4.5,0,8.1-1.37,10.54-4.07Z" />
			<path class="e1" d="M294.56,161a10,10,0,0,1-5.74,1.89c-3.56,0-5.4-2.66-5.4-7a14.21,14.21,0,0,1,.12-1.94c0-.64.22-1.48.22-1.48h0c1-5.49,3.23-8.48,4.64-9h0l.92-.4a4.12,4.12,0,0,0-.51,0c-8.92,0-15.52,6-15.52,13.16,0,5.49,3.65,9.13,10.89,9.13,4.5,0,8.1-1.37,10.54-4.07Z" />
		</g>
		<g clip-path="url(#e2)">
			<path class="e2" fill="#f8f7ff" d="M288.82,143c-.5,0-.8.34-.55.34s.35,0,.55,0c.64,0,1.16.6,1.16,2.1,0,3.56-3.3,7.76-6.39,8.06-.46,0-.45.14,0,.34a45.35,45.35,0,0,0,4.63.47c6.64,0,9.34-2.91,9.34-5.74S294.69,143,288.82,143Z" />
			<path class="e2" d="M288.82,143c-.5,0-.8.34-.55.34s.35,0,.55,0c.64,0,1.16.6,1.16,2.1,0,3.56-3.3,7.76-6.39,8.06-.46,0-.45.14,0,.34a45.35,45.35,0,0,0,4.63.47c6.64,0,9.34-2.91,9.34-5.74S294.69,143,288.82,143Z" />
		</g>
		<g clip-path="url(#b1)">
			<path class="b1" fill="#b5f4ea" d="M353.91,164h-.37a1.62,1.62,0,0,1-1.61-.87,3.83,3.83,0,0,1-.27-2.36c0-.52,1.23-8.43,1.23-8.45v-.1l.06-.4c0-.26.08-.61.14-1v-.07c.1-.7.23-1.58.36-2.58h0l2-12.55a2.84,2.84,0,0,1,1.69-.56v-.57s-5.3.1-6.76.1c-4.46,0-8.23-.13-8.23-.13l0,.43c2.18,0,3.08.77,2.66,3.81l-2.79,20c-.47,3.34-1.8,5.35-4,5.35l0,.43s3.77-.13,8.23-.13c2.11,0,4.86.09,7.65.12Z" />
			<path class="b1" d="M353.91,164h-.37a1.62,1.62,0,0,1-1.61-.87,3.83,3.83,0,0,1-.27-2.36c0-.52,1.23-8.43,1.23-8.45v-.1l.06-.4c0-.26.08-.61.14-1v-.07c.1-.7.23-1.58.36-2.58h0l2-12.55a2.84,2.84,0,0,1,1.69-.56v-.57s-5.3.1-6.76.1c-4.46,0-8.23-.13-8.23-.13l0,.43c2.18,0,3.08.77,2.66,3.81l-2.79,20c-.47,3.34-1.8,5.35-4,5.35l0,.43s3.77-.13,8.23-.13c2.11,0,4.86.09,7.65.12Z" />
		</g>
		<g clip-path="url(#b2)">
			<path class="b2" fill="#b5f4ea" d="M353.43,148.09a2.52,2.52,0,0,1-.07.4l5.93-.25v0c6.43-.38,10.76-2.87,10.76-7.63,0-4.28-5.4-6.21-10.59-6.21-2.26,0-2.45,0-2.45,0l.09.56c1.82.33,2.75,2.18,2.75,4.85C359.85,144.36,357.66,148.08,353.43,148.09Z" />
			<path class="b2" d="M353.43,148.09a2.52,2.52,0,0,1-.07.4l5.93-.25v0c6.43-.38,10.76-2.87,10.76-7.63,0-4.28-5.4-6.21-10.59-6.21-2.26,0-2.45,0-2.45,0l.09.56c1.82.33,2.75,2.18,2.75,4.85C359.85,144.36,357.66,148.08,353.43,148.09Z" />
		</g>
		<g clip-path="url(#b3)">
			<path class="b3" fill="#b5f4ea" d="M359.29,148.07h-5l-.92,0c-.06.4-.06.46-.06.46,4,0,5.28,3.77,5.28,6.64,0,3.84-2,8.63-5.1,8.78,0,.1,0,.4,0,.4l1.86,0c7.2,0,14.06-2.36,14.06-8.83C369.45,151.81,365.72,148.28,359.29,148.07Z" />
			<path class="b3" d="M359.29,148.07h-5l-.92,0c-.06.4-.06.46-.06.46,4,0,5.28,3.77,5.28,6.64,0,3.84-2,8.63-5.1,8.78,0,.1,0,.4,0,.4l1.86,0c7.2,0,14.06-2.36,14.06-8.83C369.45,151.81,365.72,148.28,359.29,148.07Z" />
		</g>
		<g clip-path="url(#o1)">
			<path class="o1" fill="#b5f4ea" d="M383.12,164.89h0c-1.16,0-1.89-2.06-1.89-5.66,0-5.51,2.06-15.7,4.21-15.93V143c-8.59.51-14,6.73-14,12.89,0,5.74,4.63,9.35,10.71,9.35.36,0,.67,0,1,0Z" />
			<path class="o1" d="M383.12,164.89h0c-1.16,0-1.89-2.06-1.89-5.66,0-5.51,2.06-15.7,4.21-15.93V143c-8.59.51-14,6.73-14,12.89,0,5.74,4.63,9.35,10.71,9.35.36,0,.67,0,1,0Z" />
		</g>
		<g clip-path="url(#o2)">
			<path class="o2" fill="#b5f4ea" d="M386.55,143c-.44,0-.86,0-1.27.06v.31a.64.64,0,0,1,.2,0c1.16,0,1.84,2.06,1.84,5.57,0,5.58-2.06,16-4.24,16a1,1,0,0,0-.17,0c-.07,0,0,.34,0,.34,8.82-.37,14.31-6.67,14.31-12.91C397.22,146.59,392.59,143,386.55,143Z" />
			<path class="o2" d="M386.55,143c-.44,0-.86,0-1.27.06v.31a.64.64,0,0,1,.2,0c1.16,0,1.84,2.06,1.84,5.57,0,5.58-2.06,16-4.24,16a1,1,0,0,0-.17,0c-.07,0,0,.34,0,.34,8.82-.37,14.31-6.67,14.31-12.91C397.22,146.59,392.59,143,386.55,143Z" />
		</g>
		<g clip-path="url(#x1)">
			<path class="x1" fill="#b5f4ea" d="M421.62,163.44c-.52,0-1-.38-1.37-1.2l-2.9-6.32-.2-.44-.6-1.26h0l-.41-.9-.23-.5h0l-2.54-5.59c-1.45-3.21-3.81-4.28-7.11-4.28a11.08,11.08,0,0,0-6.47,1.84l.17.3a1.66,1.66,0,0,1,1-.34c.69,0,1.12.77,1.42,1.45l3.09,6.73.54,1.12h0l.28.59h0l2.81,6a7.35,7.35,0,0,0,7.24,4.59,11,11,0,0,0,6.47-1.85l-.17-.3A1.7,1.7,0,0,1,421.62,163.44Z" />
			<path class="x1" d="M421.62,163.44c-.52,0-1-.38-1.37-1.2l-2.9-6.32-.2-.44-.6-1.26h0l-.41-.9-.23-.5h0l-2.54-5.59c-1.45-3.21-3.81-4.28-7.11-4.28a11.08,11.08,0,0,0-6.47,1.84l.17.3a1.66,1.66,0,0,1,1-.34c.69,0,1.12.77,1.42,1.45l3.09,6.73.54,1.12h0l.28.59h0l2.81,6a7.35,7.35,0,0,0,7.24,4.59,11,11,0,0,0,6.47-1.85l-.17-.3A1.7,1.7,0,0,1,421.62,163.44Z" />
		</g>
		<g clip-path="url(#x2)">
			<path class="x2" fill="#b5f4ea" d="M403.2,159.1c-1.42,0-2.19-.56-2.19-1.5,0-1.2,1.76-2.91,5-3.6l-.2-.39c-5.57,1.37-7.37,4.54-7.37,7.16a4.24,4.24,0,0,0,4.31,4.56,4.05,4.05,0,0,0,4.31-4c0-.05,0,.67,0-.15a3.93,3.93,0,0,0-1.19-2.67,6.79,6.79,0,0,1-1.67.47A6.11,6.11,0,0,1,403.2,159.1Z" />
			<path class="x2" d="M403.2,159.1c-1.42,0-2.19-.56-2.19-1.5,0-1.2,1.76-2.91,5-3.6l-.2-.39c-5.57,1.37-7.37,4.54-7.37,7.16a4.24,4.24,0,0,0,4.31,4.56,4.05,4.05,0,0,0,4.31-4c0-.05,0,.67,0-.15a3.93,3.93,0,0,0-1.19-2.67,6.79,6.79,0,0,1-1.67.47A6.11,6.11,0,0,1,403.2,159.1Z" />
		</g>
		<g clip-path="url(#x3)">
			<path class="x3" fill="#b5f4ea" d="M418.83,149.17c1.75,0,2.7.81,2.7,1.84,0,1.28-1.75,2.56-5,3.25l.18.35c5.79-1.2,7.16-4.5,7.16-7.16a4.17,4.17,0,0,0-4.37-4.41,3.88,3.88,0,0,0-4.24,3.81,3.74,3.74,0,0,0,1.2,2.75A7.67,7.67,0,0,1,418.83,149.17Z" />
			<path class="x3" d="M418.83,149.17c1.75,0,2.7.81,2.7,1.84,0,1.28-1.75,2.56-5,3.25l.18.35c5.79-1.2,7.16-4.5,7.16-7.16a4.17,4.17,0,0,0-4.37-4.41,3.88,3.88,0,0,0-4.24,3.81,3.74,3.74,0,0,0,1.2,2.75A7.67,7.67,0,0,1,418.83,149.17Z" />
		</g>
	</g>

	<g class="text" opacity="0">
		<path d="M80.51,237.28l-3.62-7.06h1.77l1.5,3.07c.39.84.76,1.66,1.18,2.53h.07c.4-.87.82-1.69,1.21-2.53l1.45-3.07H85.8l-3.62,7.06v3.84H80.51Z" fill="#504f59" />
		<path d="M87.28,237.07a4.05,4.05,0,1,1,4,4.25A4,4,0,0,1,87.28,237.07Zm6.4,0c0-1.76-.91-2.92-2.35-2.92S89,235.31,89,237.07s.91,2.89,2.35,2.89S93.68,238.81,93.68,237.07Z" fill="#504f59" />
		<path d="M97.54,238v-5H99.2v4.83c0,1.4.47,2.07,1.69,2.07a2.84,2.84,0,0,0,2.28-1.34V233h1.66v8.13h-1.37l-.13-1.35h-.07a3.82,3.82,0,0,1-3,1.55C98.4,241.32,97.54,240.15,97.54,238Z" fill="#504f59" />
		<path d="M108.6,233H110l.15,1.88h0a4.15,4.15,0,0,1,3.54-2.08,3.42,3.42,0,0,1,1.6.33l-.36,1.41a4.1,4.1,0,0,0-1.49-.26,3.59,3.59,0,0,0-3.19,2.24v4.61H108.6Z" fill="#504f59" />
		<path d="M126.4,233H128l.85,4.47c.13.78.24,1.5.34,2.28h.06a19.55,19.55,0,0,1,.45-2.28l.87-3.82h1.47l.85,3.82a23.13,23.13,0,0,1,.48,2.28h.07c.12-.78.2-1.5.33-2.28l.84-4.47h1.52l-1.61,8.13H132.5l-.81-3.56c-.13-.6-.25-1.4-.37-2.41h-.07c-.12.95-.24,1.73-.37,2.41l-.78,3.56h-2Z" fill="#504f59" />
		<path d="M141.36,234.31h-3.64V233H143v8.13h-1.66Zm-.54-4.09a1.24,1.24,0,0,1,2.47,0,1.24,1.24,0,0,1-2.47,0Z" fill="#504f59" />
		<path d="M147.72,233h1.36l.13,1.29h.07a4.14,4.14,0,0,1,3-1.49c1.9,0,2.77,1.17,2.77,3.28v5.05h-1.66v-4.83c0-1.42-.47-2.07-1.68-2.07a3.16,3.16,0,0,0-2.32,1.29v5.61h-1.66Z" fill="#504f59" />
		<path d="M157.19,237.07c0-2.65,1.75-4.28,3.63-4.28a3.25,3.25,0,0,1,2.34,1h0l-.08-1.43v-3h1.66v11.8h-1.36l-.13-1h0a3.78,3.78,0,0,1-2.55,1.21C158.59,241.32,157.19,239.77,157.19,237.07Zm5.93,1.78V235a2.71,2.71,0,0,0-1.92-.83c-1.27,0-2.31,1.1-2.31,2.88s.82,2.89,2.18,2.89A2.68,2.68,0,0,0,163.12,238.85Z" fill="#504f59" />
		<path d="M167.18,237.07a4.05,4.05,0,1,1,4,4.25A4,4,0,0,1,167.18,237.07Zm6.41,0c0-1.76-.92-2.92-2.36-2.92s-2.35,1.16-2.35,2.92.91,2.89,2.35,2.89S173.59,238.81,173.59,237.07Z" fill="#504f59" />
		<path d="M176.34,233H178l.84,4.47c.14.78.25,1.5.35,2.28h.06a21.84,21.84,0,0,1,.44-2.28l.88-3.82H182l.85,3.82a23.13,23.13,0,0,1,.48,2.28h.07c.12-.78.19-1.5.33-2.28l.83-4.47h1.53l-1.61,8.13h-2.05l-.81-3.56c-.13-.6-.25-1.4-.38-2.41h-.06c-.12.95-.24,1.73-.37,2.41l-.78,3.56h-2Z" fill="#504f59" />
		<path d="M201.29,234.31h-3.64V233H203v8.13h-1.66Zm-.54-4.09a1.24,1.24,0,0,1,2.47,0,1.24,1.24,0,0,1-2.47,0Z" fill="#504f59" />
		<path d="M207.65,233H209l.14,1.29h.06a4.16,4.16,0,0,1,3-1.49c1.9,0,2.77,1.17,2.77,3.28v5.05h-1.66v-4.83c0-1.42-.48-2.07-1.68-2.07a3.14,3.14,0,0,0-2.32,1.29v5.61h-1.66Z" fill="#504f59" />
		<path d="M219.47,237.9v-3.59h-2.24v-1.24l2.31-.08.21-2.58h1.38V233H225v1.32h-3.84v3.6c0,1.4.49,2.07,2,2.07a5.3,5.3,0,0,0,1.85-.34l.34,1.21a7.67,7.67,0,0,1-2.58.47C220.28,241.32,219.47,239.94,219.47,237.9Z" fill="#504f59" />
		<path d="M227.11,237.07a4.05,4.05,0,1,1,4,4.25A4,4,0,0,1,227.11,237.07Zm6.4,0c0-1.76-.91-2.92-2.35-2.92s-2.35,1.16-2.35,2.92.91,2.89,2.35,2.89S233.51,238.81,233.51,237.07Z" fill="#504f59" />
		<path d="M249.44,237.9v-3.59h-2.25v-1.24l2.31-.08.22-2.58h1.37V233h3.84v1.32h-3.84v3.6c0,1.4.5,2.07,2,2.07a5.21,5.21,0,0,0,1.85-.34l.34,1.21a7.6,7.6,0,0,1-2.57.47C250.25,241.32,249.44,239.94,249.44,237.9Z" fill="#504f59" />
		<path d="M257.59,229.32h1.66v3.13l-.1,1.83h.05a4,4,0,0,1,2.94-1.49c1.9,0,2.77,1.17,2.77,3.28v5.05h-1.66v-4.83c0-1.42-.48-2.07-1.68-2.07a3.14,3.14,0,0,0-2.32,1.29v5.61h-1.66Z" fill="#504f59" />
		<path d="M267.2,237a4.1,4.1,0,0,1,4.17-4.25,3.52,3.52,0,0,1,3.74,3.84,6.72,6.72,0,0,1-.07.9h-6.7v-1.22H274l-.35.41c0-1.76-.86-2.65-2.24-2.65s-2.59,1.05-2.59,3a2.75,2.75,0,0,0,3,3,4.43,4.43,0,0,0,2.38-.71l.58,1.05a5.77,5.77,0,0,1-3.17,1A4.13,4.13,0,0,1,267.2,237Z" fill="#504f59" />
		<path d="M287,233h1.29l.14,1h0a2,2,0,0,1,1.84-1.25c.77,0,1.28.46,1.5,1.38a2.06,2.06,0,0,1,1.88-1.38c1.15,0,1.81.91,1.81,2.54v5.79h-1.61v-5.67c0-.83-.23-1.25-.76-1.25s-.78.38-1.16,1.14v5.78h-1.43v-5.67c0-.83-.21-1.25-.74-1.25s-.82.38-1.17,1.14v5.78H287Z" fill="#504f59" />
		<path d="M297.33,239c0-1.82,1.66-2.72,5.77-3a1.8,1.8,0,0,0-2.05-1.81,5.67,5.67,0,0,0-2.75.92l-.63-1.11a7.32,7.32,0,0,1,3.68-1.15,3.09,3.09,0,0,1,3.4,3.43v4.9h-1.36l-.14-1.05h-.05a5.33,5.33,0,0,1-3.11,1.25A2.47,2.47,0,0,1,297.33,239Zm5.77-.06V237c-3.2.22-4.14.87-4.14,1.84,0,.82.73,1.15,1.6,1.15A4.07,4.07,0,0,0,303.1,238.91Z" fill="#504f59" />
		<path d="M307.18,242.58a2.16,2.16,0,0,1,1.32-1.76v-.07a1.5,1.5,0,0,1-.83-1.35,2,2,0,0,1,1-1.52v-.07a2.57,2.57,0,0,1-1-2.1,3,3,0,0,1,3.27-2.92,3.4,3.4,0,0,1,1.24.2h3.35v1.29h-2a2.34,2.34,0,0,1,.59,1.49c0,1.77-1.41,2.78-3.2,2.78a3.56,3.56,0,0,1-1.3-.27,1,1,0,0,0-.57.85c0,.58.57.85,1.61.85h1.74c2.1,0,3.15.55,3.15,2,0,1.56-1.79,2.86-4.6,2.86C308.61,244.79,307.18,244,307.18,242.58Zm6.74-.38c0-.71-.59-.9-1.75-.9h-1.44a4.77,4.77,0,0,1-1.23-.12c-.68.37-.92.78-.92,1.21,0,.79.89,1.26,2.5,1.26S313.92,243,313.92,242.2Zm-1.32-6.49a1.71,1.71,0,1,0-1.71,1.77A1.68,1.68,0,0,0,312.6,235.71Z" fill="#504f59" />
		<path d="M321.15,234.31h-3.64V233h5.3v8.13h-1.66Zm-.54-4.09a1.24,1.24,0,0,1,2.47,0,1.24,1.24,0,0,1-2.47,0Z" fill="#504f59" />
		<path d="M327.33,237.07c0-2.72,2.1-4.28,4.58-4.28a4.2,4.2,0,0,1,3,1.16l-.8,1.05a3.24,3.24,0,0,0-2.11-.85,2.79,2.79,0,0,0-3,2.92,2.75,2.75,0,0,0,2.91,2.89,3.76,3.76,0,0,0,2.41-1l.72,1.07a5,5,0,0,1-3.26,1.25C329.25,241.32,327.33,239.76,327.33,237.07Z" fill="#504f59" />
		<path d="M337.29,239c0-1.82,1.65-2.72,5.76-3a1.8,1.8,0,0,0-2.05-1.81,5.6,5.6,0,0,0-2.74.92l-.64-1.11a7.38,7.38,0,0,1,3.68-1.15,3.09,3.09,0,0,1,3.41,3.43v4.9h-1.37l-.13-1.05h-.06a5.33,5.33,0,0,1-3.11,1.25A2.46,2.46,0,0,1,337.29,239Zm5.76-.06V237c-3.2.22-4.14.87-4.14,1.84,0,.82.73,1.15,1.6,1.15A4,4,0,0,0,343.05,238.91Z" fill="#504f59" />
		<path d="M350,238.27v-7.63h-2.8v-1.32h4.45v9.05a1.41,1.41,0,0,0,1.54,1.59,3.66,3.66,0,0,0,1.45-.34l.4,1.23a5.44,5.44,0,0,1-2.24.47C350.93,241.32,350,240.23,350,238.27Z" fill="#504f59" />
		<path d="M366.12,233h1.62l.85,4.47c.14.78.24,1.5.34,2.28H369a19.52,19.52,0,0,1,.44-2.28l.87-3.82h1.47l.86,3.82c.18.78.37,1.5.48,2.28h.06c.13-.78.2-1.5.33-2.28l.84-4.47h1.53l-1.62,8.13h-2.05l-.8-3.56c-.13-.6-.26-1.4-.38-2.41H371c-.11.95-.23,1.73-.37,2.41l-.78,3.56h-2Z" fill="#504f59" />
		<path d="M376.93,237.07a4.06,4.06,0,1,1,4.06,4.25A4,4,0,0,1,376.93,237.07Zm6.41,0c0-1.76-.92-2.92-2.35-2.92s-2.36,1.16-2.36,2.92S379.55,240,381,240,383.34,238.81,383.34,237.07Z" fill="#504f59" />
		<path d="M388.26,233h1.38l.15,1.88h0a4.14,4.14,0,0,1,3.54-2.08,3.45,3.45,0,0,1,1.6.33l-.37,1.41a4,4,0,0,0-1.49-.26,3.6,3.6,0,0,0-3.19,2.24v4.61h-1.66Z" fill="#504f59" />
		<path d="M399.89,238.27v-7.63h-2.8v-1.32h4.46v9.05a1.4,1.4,0,0,0,1.53,1.59,3.74,3.74,0,0,0,1.46-.34l.39,1.23a5.44,5.44,0,0,1-2.24.47C400.87,241.32,399.89,240.23,399.89,238.27Z" fill="#504f59" />
		<path d="M406.9,237.07c0-2.65,1.74-4.28,3.63-4.28a3.27,3.27,0,0,1,2.34,1h0l-.08-1.43v-3h1.66v11.8h-1.36l-.13-1h-.06a3.76,3.76,0,0,1-2.55,1.21C408.29,241.32,406.9,239.77,406.9,237.07Zm5.93,1.78V235a2.73,2.73,0,0,0-1.93-.83c-1.26,0-2.3,1.1-2.3,2.88s.82,2.89,2.17,2.89A2.7,2.7,0,0,0,412.83,238.85Z" fill="#504f59" />
		<path d="M426.88,237.07a4.05,4.05,0,1,1,4.05,4.25A4,4,0,0,1,426.88,237.07Zm6.4,0c0-1.76-.91-2.92-2.35-2.92s-2.36,1.16-2.36,2.92.92,2.89,2.36,2.89S433.28,238.81,433.28,237.07Z" fill="#504f59" />
		<path d="M437.55,233.07l2.32-.08h4.84v1.32h-7.16Zm2.28-.64a3,3,0,0,1,3.37-3.31,6.25,6.25,0,0,1,2.37.46l-.35,1.23a4.48,4.48,0,0,0-1.84-.37,1.7,1.7,0,0,0-1.91,1.95v8.73h-1.64Z" fill="#504f59" />
		<path d="M456.94,239.72l1-1.15a4.59,4.59,0,0,0,3.12,1.29c1.38,0,2.14-.64,2.14-1.51,0-1.07-.79-1.37-1.87-1.82l-1.54-.68a3.13,3.13,0,0,1-2.34-2.85c0-1.7,1.53-3,3.69-3a4.84,4.84,0,0,1,3.42,1.37l-.86,1.06a3.85,3.85,0,0,0-2.63-1c-1.15,0-1.92.53-1.92,1.42s.94,1.3,1.9,1.67l1.48.65c1.36.53,2.39,1.33,2.39,2.92,0,1.75-1.48,3.18-3.95,3.18A5.76,5.76,0,0,1,456.94,239.72Z" fill="#504f59" />
		<path d="M466.47,230.22h1.78l1.63,5.67c.37,1.26.62,2.32,1,3.57H471c.38-1.25.65-2.31,1-3.57l1.63-5.67h1.71l-3.41,10.9h-2Z" fill="#504f59" />
		<path d="M476.72,235.69c0-3.56,2.06-5.67,4.89-5.67a4.09,4.09,0,0,1,3.05,1.34l-.94,1a2.71,2.71,0,0,0-2.11-.93c-1.89,0-3.15,1.59-3.15,4.16s1.12,4.22,3.15,4.22a2.42,2.42,0,0,0,1.66-.55v-2.6h-2v-1.37h3.55V240a4.73,4.73,0,0,1-3.3,1.28C478.75,241.32,476.72,239.27,476.72,235.69Z" fill="#504f59" />
		<path d="M489.35,239.77a1.51,1.51,0,1,1,3,0,1.51,1.51,0,1,1-3,0Z" fill="#504f59" />
	</g>

	<g class="cursor" opacity="0" fill="#504f59">
		<g class="click" opacity="0">
			<path d="M380.49,100.22l1.73,2.57.24.36a.75.75,0,1,0,1.25-.84L382,99.74l-.25-.36a.76.76,0,0,0-1-.21.77.77,0,0,0-.21,1Z" />
			<path d="M379.15,112.73l2.58-1.73.36-.24a.75.75,0,1,0-.84-1.25l-2.57,1.72-.37.25a.76.76,0,0,0-.2,1,.75.75,0,0,0,1,.2Z" />
			<path d="M390.93,104.82l2.58-1.73.36-.24a.77.77,0,0,0,.21-1,.78.78,0,0,0-1.05-.21l-2.57,1.73-.37.25a.75.75,0,0,0,.84,1.25Z" />
			<path d="M377.21,106.17l3,.6.43.08a.75.75,0,1,0,.29-1.48l-3-.6-.43-.08a.75.75,0,0,0-.88.59.76.76,0,0,0,.59.89Z" />
			<path d="M387.84,102.08l.6-3,.08-.43a.75.75,0,0,0-.59-.88.76.76,0,0,0-.89.59l-.6,3-.08.43a.75.75,0,1,0,1.48.29Z" />
		</g>
		<polygon points="384.95 105.29 387.3 117.78 390.31 112.79 396.16 111.9 384.95 105.29" />
	</g>
</svg>

<button class="button">replay</button>
  <head>    
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <link rel="stylesheet" href="https://dev.qwiket.com/gasp/gasp.css">  
  <script
  src="https://code.jquery.com/jquery-3.7.1.js"
  integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
  crossorigin="anonymous"></script>
  <script src="https://dev.qwiket.com/gasp/gasp.js"></script>
 
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
 * ffmpeg -i video.mp4 -vf "fps=30,scale=1080:1080:flags=lanczos,palettegen" palette.png
 * 
 * ffmpeg -i video.mp4 -i palette.png -filter_complex "fps=30,scale=1080:1080:flags=lanczos[x];[x][1:v]paletteuse" video.gif
 * 
 * 
 */