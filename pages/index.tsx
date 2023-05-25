import { useState, useCallback } from "react"
import { useRouter } from 'next/router'
import {
  GetServerSidePropsContext,
} from "next";

import Head from 'next/head'
import axios from "axios";
import Image from 'next/image'
import { Inter } from 'next/font/google'

import { styled } from 'styled-components';
import GlobalStyle from '../components/globalstyles'
import { ThemeProvider } from 'styled-components'
import { palette } from '../lib/palette';
import { Roboto } from '@next/font/google';
import { withSessionSsr, Options } from '../lib/with-session';
import Occasion from "../components/fields/occasion";
import From from "../components/fields/who";
import To from "../components/fields/to";
import Age from "../components/fields/age";
import Sex from "../components/fields/sex";
import Interests from "../components/fields/interests";
import Output from "../components/output";

const Form = styled.form`
  width:100%;
  @media (min-width: 768px) {
    margin-left:0px;
    max-width: 800px;
  }
`;

const Wrap = styled.div`
  display:flex;
  flex-direction:column;
  padding-left:20px;
  padding-right:20px;
  align-items:center;

  @media (min-width: 768px) {
      margin-left:0px;    
  }
`;

const FullPageContainer = styled.div`
  //height: 100vh;
  //width: 100vw;
  //background: linear-gradient(to bottom, #000000, #333333);
  
  display: flex;
  width: 100%;

  justify-content: center;
  align-items: center;
  padding: 0 20px;

  @media(min-width: 900px) {    
    padding: 0 40px;
  }
  @media(min-width: 1200px) { 
    padding: 0 80px;
  }
  @media(min-width: 2400px) { 
    padding: 0 200px;
  }
`;

const ContentTop = styled.div`
  /* Styles for the centered div */
  color: white;
  margin-top:20px;
  margin-bottom:10px;
 
  //display: flex;
  //justify-content: ;
  //margin-right:auto;
  //width:100%
  font-size:19px;
  width:280px;
  
  @media(min-width: 900px) {
    font-size:34px;
    width:480px;
  }
  @media(min-width: 1200px) {
    font-size:49px;
    width:680px;
  }
  @media(min-width: 2400px) {
    font-size:69px;
  }
`;
const TopContainer = styled.div`
  color: white;
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-left:auto;
  //margin-right:auto;
  `;

const Hr = styled.hr`
  margin-bottom:40px;
`;
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })

const inter = Inter({ subsets: ['latin'] })

export default function Home({ from: startFrom, to: startTo, occasion: startOccasion, interests: startInterests, age: startAge, sex: startSex, session: startSession }: { from: string, to: string, occasion: string, age: string, sex: string, interests: string, session: Options }) {

  const [session, setSession] = useState(startSession);
  const [theme, setTheme] = useState(session.dark != -1 ? session.dark == 1 ? 'dark' : 'light' : "unknown")
 
  const [occasion, setOccasion] = useState(startOccasion);
  const [age, setAge] = useState(startAge);
  const [sex, setSex] = useState(startSex);
  const [from, setFrom] = useState(startFrom);
  const [to, setTo] = useState(startTo);
  const [interests, setInterests] = useState(startInterests);
  const router = useRouter();

  //saves the changes to the session on the local web server. 
  const updateSession2 = useCallback(async (updSession: object) => {
    const assigned = { ...Object.assign(session, updSession) }
    console.log('===>pdate session:', assigned);
    setSession(assigned);
    await axios.post(`/api/session/save`, { session: updSession });
  },[]);

  const updateRoute = ({ to, from, occasion, interests, sex, age }: { to: string, from: string, occasion: string, interests: string, sex: string, age: string }) => {
    const params = `/?occasion=${encodeURIComponent(occasion)}${to ? `&to=${encodeURIComponent(to)}` : ``}${from ? `&from=${encodeURIComponent(from)}` : ``}${interests ? `&interests=${encodeURIComponent(interests)}` : ``}${sex ? `&sex=${encodeURIComponent(sex)}` : ``}${age ? `&age=${encodeURIComponent(age)}` : ``}`;
    router.push(params, params, { shallow: true })
  }
  const onOccasionChange = (opt: any) => {
    console.log('set occasion:', opt.label);
    updateRoute({
      from,
      to,
      occasion: opt.label,
      interests,
      sex,
      age
    })
    setOccasion(opt.label);
  }

  const onAgeChange = (opt: any) => {

    console.log(opt.value);
    updateRoute({
      from,
      to,
      occasion,
      interests,
      sex,
      age: opt.label != '0' ? opt.label : ""
    })

    setAge(opt.label != '0' ? opt.label : "");
  }
  const onFromChange = (opt: any) => {
    console.log(opt.value);
    updateRoute({
      from: opt.label,
      to,
      occasion,
      interests,
      sex,
      age
    })

    setFrom(opt.label);
  }
  const onToChange = (opt: any) => {
    console.log(opt.value);
    updateRoute({
      from,
      to: opt.label,
      occasion,
      interests,
      sex,
      age
    })
    setTo(opt.label);
  }
  const onInterestsChange = (opt: any) => {
    console.log(opt.value);
    updateRoute({
      from,
      to,
      occasion,
      interests: opt.label,
      sex,
      age
    })
    setInterests(opt.label);
  }
  const onSexChange = (opt: any) => {
    console.log(opt.value);
    updateRoute({
      from,
      to,
      occasion,
      interests,
      sex: opt.label,
      age
    })
    setSex(opt.label);
  }

  console.log("occasion", occasion);

  return (
    <>
      <Head>
        <title>Free Wish Text Generator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content={theme == 'dark' ? palette.dark.colors.background : palette.light.colors.background} />

      </Head>
      <main className={roboto.className} >
        <ThemeProvider theme={palette}>
          <GlobalStyle />
          <FullPageContainer>
            <div>
              <TopContainer><ContentTop>FREE WISH TEXT GENERATOR</ContentTop></TopContainer><Hr />
              <Wrap>
                <Form>
                  <Occasion value={occasion} onChange={onOccasionChange} />
                  <To value={to} onChange={onToChange} />
                  <From value={from} onChange={onFromChange} />
                  <Age value={age} onChange={onAgeChange} disable={occasion != 'Birthday'} />
                  <Sex value={age} onChange={onSexChange} />
                  <Interests value={interests} onChange={onInterestsChange} />
                </Form>
                <Output session={session} updateSession2={updateSession2} from={from} to={to} age={age} occasion={occasion} interests={interests} />
              </Wrap>
            </div>
          </FullPageContainer>
        </ThemeProvider>
      </main>
    </>
  )
}
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
      let { from, to, occasion, age, interests, sex }: { from: string, to: string, occasion: string, age: string, interests: string, sex: string } = context.query as any;
      from = from || '';
      to = to || '';
      occasion = occasion || '';
      age = age || '';
      interests = interests || '';
      sex = sex || '';


      let startoptions = context.req.session?.options || null;
      if (!startoptions) {
        var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        startoptions = {
          sessionid: randomstring(),
          dark: -1,
        }
        context.req.session.options = startoptions;
        await context.req.session.save();
      }
      let options: Options = startoptions;
      console.log("SSR:", options.giftSuggestions)
      return {
        props: {
          from: from,
          to: to,
          occasion: occasion,
          age: age,
          interests: interests,
          sex: sex,
          session: options,
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
