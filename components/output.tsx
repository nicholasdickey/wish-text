import React, { useState, FormEvent, useEffect } from "react";
import { styled } from "styled-components";
import Element from "./element";
import { getWishText } from "../lib/api";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import AmazonIdeaSearch from "./amazonIdeaSearch";
import { Options } from "../lib/with-session";
import AdIntro from "./ad-intro";
import Select from 'react-select';


const Container = styled.div`
    display: flex;
  
    //background-color: aliceblue;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  `;

const InnerOutput = styled.div<{ persona?: string,length:number }>`
  position: relative;
  display: flex; /* Use Flexbox */
  flex-direction: column; /* Arrange content vertically */
  align-items: flex-start; /* Align content to the start of the container */

  font-size:${({length})=>`${length<400?'21':length<500?'19':length<600?'16':'14'}`}px;
  //margin-right: 20px;
  margin-top: 10px;
  width: 100%;
  min-height: 420px;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding: 20px;
  width: 320px;

  @media (min-width: 600px) {
    width: 400px;
  }
  @media (min-width: 900px) {
    width: 480px;
  }
  @media (min-width: 1200px) {
    width: 520px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Adjust the opacity as desired */
    border-radius: 30px;
    z-index: 1; /* Set a higher z-index for the pseudo-element */
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${({ persona }) => (persona ? `url(${personaImages[persona]})` : 'none')};
    background-size: cover;
    opacity: 0.9; /* Adjust the opacity as desired */
    border-radius: 30px;
    z-index: 0; /* Set a lower z-index for the image background */
  }

  & p {
    opacity:0.8;
    margin-top: auto;
    bottom:0;
   // margin-top: 10px;
    color: white; /* Set the text color to white */
    position: relative;
    z-index: 2; /* Set a higher z-index for the text to appear above the pseudo-element */
  }
  & div#adintro {
    opacity:1.0;
    
    margin-top: 10px;
    color: white; /* Set the text color to white */
    position: relative;
    z-index: 2; /* Set a higher z-index for the text to appear above the pseudo-element */
  }
`;


const ButtonContainer = styled.div`
    position:relative;

    display:flex;
    justify-content:space-around;
    padding:20px;
    width:100%;
    `
interface LoadingProps {
  loading: boolean;
}
const Button = styled.button<LoadingProps>`
  background:#048080;
  padding:6px 20px;
  color:${({ loading }) => !loading ? 'white' : 'grey'};
  border-radius:10px;
  &:hover{
    background:${({ loading }) => !loading ? '#037070' : '#048080'};
    cursor:pointer;
  
}
`;
const OuterWrap = styled.div`
`;

const BottomLink = styled.div`
//position:absolute;
//bottom:-0;
//background-color:darkgoldenrod;
padding:10px;
z-index:100;
`
const GeneratingPlaceholder = styled.div`
  font-size: 14px;
  max-width:400px;
  margin:80px;
  `;
  const PersonaImage = styled.img`
  width:100%;
  max-width:400px;
  margin:10px;
  `;
function splitStringByNumberedSentences(input: string): string[] {
  //const regex = /^\d+\.(.*?\.)/gm;
  const regex = /^\d+\.(.*)$/gm;
  const matches = input.match(regex);

  if (!matches) {
    return [];
  }

  return matches.map((match) => match.trim());
}
function extractDoubleQuotedPart(input: string): string {
  console.log("extractDoubleQuotedPart", input, "input")
  const regex = /"([^"]*)"/;
  const match = input.match(regex);

  if (match && match.length >= 2) {
    console.log("match[1]", match[1])
    return match[1];
  }

  return "";
}

const text = ['This Amazing AI experience', 'Brought to you', 'By', 'THE', 'AMERICAN', 'OUDOORSMAN', 'NEWS', 'www.american-outdoorsman.news'];
const loadingText = ['Preparing the inputs', 'Connecting to the NSA supercomputer in Provo, UT', 'Inserting rods', 'Cooling jets', 'Turning the crankshaft', 'Waiting for the blinking lights', 'Negotiating the protocol', 'Streaming the response']
const personas=[
  {
    id:'dirtyharry',
    name:'Dirty Harry', 
    image:'https://ucarecdn.com/148bd941-c9b1-4a91-8adf-4a6aca24bf8e/dirtyharryfullcontempt.jpg'},
  {
    id:'oddball',
    name: 'Oddball',
    image:'https://ucarecdn.com/e2cbaf71-6dc3-444d-8bce-1f3356931912/OddballKellysHeroesDonaldSutherlandb.jpg'},
  {
    id:'marktwain',
    name: 'Mark Twain',
    image:'https://ucarecdn.com/9ef96397-179c-4afd-8245-185e23b822a8/gettyimages683484482612x612.jpg'
  },
{
  id:'jessicafletcher',
  name: 'Jessica Fletcher',
  image:'https://ucarecdn.com/f6718963-eef0-4e28-9322-1e08d90788e2/gorgeous.jpg'
},
{
  id:'rickfromcasablanca',
  name: 'Rick from Casablanca',
  image: "https://ucarecdn.com/b87e885e-ab91-41bc-887a-f13ae959683a/Humphrey_Bogart_in_Casablanca_trailer.jpg"

},
{
  id:'jamesbond',
  name: 'James Bond',
  image: "https://ucarecdn.com/f7b6e0ac-59ce-4db4-aa8d-6a2b660a7c2a/jamesBondSean.jpg"
},
{
  id:'spock',
  name: 'Spock',
  Image:'https://ucarecdn.com/e3ab2315-7148-4d23-a4a4-2d2d1c12e6f4/8b10a9280bd46b8874af9b5cadec91d5.webp'
},
{
  id:'birthday1',
  name: 'Birthday 1',
  Image:'https://ucarecdn.com/7ca78240-d3ca-4169-99a5-9f15aef5c2dd/5sX1r5ThaA8iYi5lxrgN2cj2fa.jpg'
}]
  type Persona = {[key: string] : string}
const personaImages:Persona={
  "dirtyharry":'https://ucarecdn.com/148bd941-c9b1-4a91-8adf-4a6aca24bf8e/dirtyharryfullcontempt.jpg',
  "oddball":'https://ucarecdn.com/e2cbaf71-6dc3-444d-8bce-1f3356931912/OddballKellysHeroesDonaldSutherlandb.jpg',
  "marktwain":'https://ucarecdn.com/9ef96397-179c-4afd-8245-185e23b822a8/gettyimages683484482612x612.jpg',
  "jessicafletcher":'https://ucarecdn.com/f6718963-eef0-4e28-9322-1e08d90788e2/gorgeous.jpg',
  "rickfromcasablanca": "https://ucarecdn.com/b87e885e-ab91-41bc-887a-f13ae959683a/Humphrey_Bogart_in_Casablanca_trailer.jpg",
  "jamesbond": "https://ucarecdn.com/f7b6e0ac-59ce-4db4-aa8d-6a2b660a7c2a/jamesBondSean.jpg",
  "spock": "https://ucarecdn.com/e3ab2315-7148-4d23-a4a4-2d2d1c12e6f4/8b10a9280bd46b8874af9b5cadec91d5.webp",
  "birthday1":"https://ucarecdn.com/7ca78240-d3ca-4169-99a5-9f15aef5c2dd/5sX1r5ThaA8iYi5lxrgN2cj2fa.jpg",
}
const personaNames:Persona={
  "dirtyharry":'Clint Eastwood as Dirty Harry',
  "oddball":'Donald Sutherland as Oddball',
  "marktwain":'Mark Twain',
  "jessicafletcher":'Angela Lansbury as Jessica Fletcher',
  "rickfromcasablanca": "Humphrey Boghart as Rick from Casablanca",
  "jamesbond": "Sean Connery as James Bond",
  "spock": "Leonard Nimoy as Spock",
  "birthday1":"Birthday 1",
}
export default function Output({ setLoadReady,session, updateSession2, from, to, occasion, reflections }: { setLoadReady:any,session: Options, updateSession2: any, from: string, to: string, occasion: string, reflections: string }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [checked,setChecked] = useState(false);
  const [persona,setPersona] =useState('');
  const [greeting, setGreeting] = useState(session.greeting || '');
  console.log("GREETING:",persona, greeting, 'value', value);
  // generate code to parse the value for double quoted strings
  //  
 
  const handleChange = () => {
    setChecked(!checked);
  };
  type MyOption = {label: string, value: string}
  const handleSelectChange = (selected?: MyOption  | null) => {
    if (selected==null)
    return
    console.log("handleSelectChange", selected);
    setPersona(selected?.value || '');
  }
  return <OuterWrap data-id="Greetings-Output:OuterWrap">
    <ButtonContainer><Button loading={loading}><a onClick={async () => {
    if (loading)
      return;
    console.log("calling api with", from, to, occasion, reflections);
    setLoading(true);
    setLoadReady(true);
    const result = await getWishText({ style:persona&&checked?personaNames[persona]:'',from, to, occasion, reflections, fresh: value ? true : false });
    setLoading(false);
    setLoadReady(false);
    console.log("result", result, 'value:', value);
    if (result != value) {
      console.log("setting value", result)
      setGreeting(result);
      setValue(result);
    }
  }}>{value ? 'Try again' : 'Generate'}!</a></Button>
  
  {process.env.EXPERIMENT?<><label>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        As Persona
      </label>
  <div style={{color:'black', zIndex:1001}}><Select  onChange={handleSelectChange} options={personas.map(m=>{return {value:m.id,label:m.name}})} /></div>
  </>:null}
  </ButtonContainer>
    <Container>
     
      <InnerOutput data-id="GreetingsOutput:InnerOutput"  length={greeting.length}>
        {!loading ? <ReactMarkdown rehypePlugins={[rehypeRaw]} >{loading ? 'Generating...' : greeting}</ReactMarkdown>
          : <div style={{width:'100%',position:'relative'}} id="adintro"><AdIntro ad={{ text, bottomLink: 'https://www.american-outdoorsman.news', loadingText }} /> </div>}

      </InnerOutput>
      {loading ? null : <BottomLink><a href="https://www.american-outdoorsman.news">Sponsor: www.american-outdoorsman.news</a></BottomLink>}

      
    </Container> </OuterWrap>

}