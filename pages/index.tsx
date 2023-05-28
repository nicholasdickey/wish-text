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

import GreetingOutput from "../components/output";
import GiftsOutput from "../components/gifts";
import FormField from "../components/form-field";


const Wrap = styled.div`
  display:flex;
  width:100%;
  flex-direction:column;
  //padding-left:20px;
  //padding-right:20px;
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
  flex-direction: column;
  width: 100%;

  justify-content: center;
  align-items: center;
  //padding: 0 20px;

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
 
  font-size:19px;

  
  @media(min-width: 900px) {
    font-size:34px;
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
  width: 100%;
  margin-bottom:40px;
`;


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;
interface LabelProps {
  hasValue: boolean;
}
const Label = styled.label<LabelProps>`
  position: absolute;
  top: ${(props) => (props.hasValue ? '-12px' : '12px')};
  left: ${(props) => (props.hasValue ? '0px' : '12px')};
  color: ${(props) => (props.hasValue ? '#888' : '#555')};
  transition:  top 0.2s, font-size 0.2s, color 0.2s;
  pointer-events: none;
  font-size: ${(props) => (props.hasValue ? '14px' : '16px')};
`;

const Input = styled.input`
  width: 300px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height:32px;
  margin-top:6px;
 // margin-left:10px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;
const HelpText = styled.p`
  font-size: 13px;
  color: #888;
  margin-top: 8px;
  word-wrap: break-word;
  width: 300px;
`;

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
  

export default function Home({ from: startFrom, to: startTo, occasion: startOccasion, reflections: startReflections, interests: startInterests,session: startSession }: { from: string, to: string, occasion: string, reflections: string, interests: string, session: Options }) {

  const [session, setSession] = useState(startSession);
  const [theme, setTheme] = useState(session.dark != -1 ? session.dark == 1 ? 'dark' : 'light' : "unknown")

  const [occasion, setOccasion] = useState(startOccasion);
  const [reflections, setReflections] = useState(startReflections);

  const [from, setFrom] = useState(startFrom);
  const [to, setTo] = useState(startTo);
  const [interests, setInterests] = useState(startInterests);
  const [loadReady, setLoadReady] = useState(false);
  const router = useRouter();

  //saves the changes to the session on the local web server. 
  const updateSession2 = useCallback(async (updSession: object) => {
    const assigned = { ...Object.assign(session, updSession) }
    console.log('===>pdate session:', assigned);
    setSession(assigned);
    await axios.post(`/api/session/save`, { session: updSession });
  }, []);

  const updateRoute = ({ to, from, occasion, reflections, interests }: { to: string, from: string, occasion: string, reflections: string, interests: string}) => {
    const params = `/?occasion=${encodeURIComponent(occasion)}${reflections ? `&reflections=${encodeURIComponent(reflections)}` : ``}${to ? `&to=${encodeURIComponent(to)}` : ``}${from ? `&from=${encodeURIComponent(from)}` : ``}${interests ? `&interests=${encodeURIComponent(interests)}` : ``}`;
    router.push(params, params, { shallow: true })
  }
  const onOccasionChange = (event: any) => {
    const value = event.target.value;
    console.log('set occasion:', value);
    updateRoute({
      from,
      to,
      occasion: value,
      reflections,
      interests,
    })
    setOccasion(value);
  }
  const onReflectionsChange = (event: any) => {
    const value = event.target.value;
    console.log('set reflections:', value);
    updateRoute({
      from,
      to,
      occasion,
      reflections: value,
      interests,
    })
    setReflections(value);
  }

  
  const onFromChange = (event: any) => {
    const value = event.target.value;
    console.log(value);
    updateRoute({
      from: value,
      to,
      occasion,
      reflections,
      interests,
      
    })

    setFrom(value);
  }
  const onToChange = (event: any) => {
    const value = event.target.value;
    console.log(value);
    updateRoute({
      from,
      to: value,
      occasion,
      reflections,
      interests,
      
    })
    setTo(value);
  }
  const onInterestsChange = (event: any) => {
    const value = event.target.value;
    console.log(value);
    updateRoute({
      from,
      to,
      occasion,
      reflections,
      interests: value,
     
    })
    setInterests(value);
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

            <TopContainer><ContentTop>FREE WISH TEXT GENERATOR</ContentTop></TopContainer><Hr />
            <Wrap>
              <FormContainer>
                <FormField value={occasion} label="Occasion"  onChange={onOccasionChange} help="Required for a meaningful result. For example: &ldquo;8th Birthday&rdquo;, &ldquo;Sweet Sixteen&rdquo;, &ldquo;Illness&rdquo; &ldquo;Death in the family&rdquo;, &ldquo;Christmas&rdquo;, &ldquo;Graduation&ldquo;"/>
                <FormField value={to} label="To (Recepient)" onChange={onToChange} help="Examples: &ldquo;Our nephew Billy&rdquo;, &ldquo;My Grandson Evan&rdquo;, &ldquo;My Love&rdquo; &ldquo;Love of My Life&rdquo;, &ldquo;Simpsons&rdquo;, &ldquo;Mr Williams, the postman.&ldquo;"/>  
                <FormField value={from} label="From" onChange={onFromChange} help="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."/>
                <FormField value={reflections} label="Additional Reflections and Thoughts" onChange={onReflectionsChange} help="Any thoughts that you have about what should be reflected in the greeting."/>
                
              
              </FormContainer>
              <GreetingOutput setLoadReady={setLoadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} reflections={reflections}  />
              <GiftsOutput loadReady={loadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} reflections={reflections} interests={interests} onInterestsChange={onInterestsChange} />
            </Wrap>

          </FullPageContainer>
        </ThemeProvider>
      </main>
    </>
  )
}
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
      let { from, to, occasion, reflections, age, interests, sex }: { from: string, to: string, occasion: string, reflections: string, age: string, interests: string, sex: string } = context.query as any;
      from = from || '';
      to = to || '';
      occasion = occasion || '';
      age = age || '';
      interests = interests || '';
      sex = sex || '';
      reflections = reflections || '';

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
          reflections: reflections,
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


/*

<Form>
                <Occasion value={occasion} onChange={onOccasionChange} />
                <To value={to} onChange={onToChange} />
                <From value={from} onChange={onFromChange} />
                <Reflections value={reflections} onChange={onReflectionsChange} />
                {false?<div><Age value={age} onChange={onAgeChange} disable={occasion != 'Birthday'} />
                <Sex value={age} onChange={onSexChange} />
                </div>:null}
                <Interests value={interests} onChange={onInterestsChange} />
              </Form>


              */