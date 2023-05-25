import React, { useState, FormEvent, useEffect } from "react";
import { styled } from "styled-components";
import Element from "./element";
import { getWishText } from "../lib/api";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import AmazonIdeaSearch from "./amazonIdeaSearch";
import { Options } from "../lib/with-session";

const Container = styled.div`
    display: flex;
    //background-color: aliceblue;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
   // margin-left:15px;
   // margin-right:15px;
   // width:100%;
    
    `;
const InnerOutput = styled.div`
  font-size: 14px;
 // margin-left: 160px;
  background-color: darkgoldenrod;
  //margin-right: 90px;
 // margin-left:10px;
  margin-top:10px;
  //width: 100%;
  min-height: 140px;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding:20px;
  //margin-left:20px;
  //margin-right:20px;
  width: 320px;

  @media(min-width: 600px) {
    //font-size:34px;
    width:400px;
  }
  @media(min-width: 900px) {
    
    width:680px;
  }
  @media(min-width: 1200px) {
    width:800px;
  }
  & p{
    margin-top:10px;
  }
`;
const InnerGifts = styled.div`
  font-size: 14px;
  margin-right: 20px;
 // margin-left:10px;
  margin-top:10px;
  width: 100%;
  min-height: 140px;
  
 // max-width: 800px;
  & p{
    margin-top:10px;
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
const OuterWrap=styled.div`
`;
const GiftSuggesstionHeader = styled.div`
text-align:center;
margin-bottom:10px;
margin-top:50px;
`
function splitStringByNumberedSentences(input: string): string[] {
  //const regex = /^\d+\.(.*?\.)/gm;
  const regex=/^\d+\.(.*)$/gm;
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
interface GiftSuggestion {
  text: string;
  search: string;
}
const processGiftSuggestions = (valueGiftSuggestions: string) => {
  const giftSuggestionsParts = splitStringByNumberedSentences(valueGiftSuggestions);
  
  return giftSuggestionsParts.map((giftSuggestion, index) => {
    giftSuggestion = giftSuggestion.replaceAll("Amazon search:","");
    return { text: giftSuggestion, search: extractDoubleQuotedPart(giftSuggestion) };
  });
}
export default function Output({ session, updateSession2, from, to, occasion,reflections, age, interests }: { session: Options, updateSession2: any, from: string, to: string, occasion: string, reflections: string,age: string, interests: string }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState(session.greeting || '');
  const [giftSuggestions, setGiftSuggestions] = useState(session.giftSuggestions ? processGiftSuggestions(session.giftSuggestions) : Array<GiftSuggestion>());
  console.log("GREETING:",greeting,'value',value,'giftSuggestions',giftSuggestions);
  // generate code to parse the value for double quoted strings
  //  
  const output = greeting ? <><GiftSuggesstionHeader><h1>Gift Suggestions:</h1></GiftSuggesstionHeader><div> {giftSuggestions.map((suggest: GiftSuggestion, i: number) => {
   // if (i >0)
   //   return null;
    return <AmazonIdeaSearch key={`amazon-idea-search-${i}`} search={suggest.search} text={suggest.text} />
  })}</div></> : null;

  return <OuterWrap><ButtonContainer><Button loading={loading}><a onClick={async () => {
    if (loading)
      return;
    console.log("calling api with", from, to, occasion,reflections, age, interests);
    setLoading(true);
    const result = await getWishText({ from, to, occasion, reflections,age, interests });
    setLoading(false);
    console.log("result", result,'value:' ,value);
    if (result != value) {
      console.log("setting value", result)
      const valueParts = result.split("Gift Suggestions:");
      if(valueParts.length<2)
        return;
      setGreeting(valueParts[0]);
      const valueGiftSuggestions = valueParts[1];
      updateSession2({ greeting: valueParts[0], giftSuggestions: valueGiftSuggestions });
      console.log("Button returned",{ greeting: valueParts[0], giftSuggestions: valueGiftSuggestions })

      setGiftSuggestions(processGiftSuggestions(valueGiftSuggestions));
      console.log("setting after processGiftSuggestions", processGiftSuggestions(valueGiftSuggestions));
      setValue(result);
    }
  }}>{value ? 'Try again' : 'Generate'}!</a></Button></ButtonContainer>
  <Container>
    <InnerOutput>
    <ReactMarkdown rehypePlugins={[rehypeRaw]} >{loading ? 'Generating...' : greeting}</ReactMarkdown>
  </InnerOutput> {loading?null:<InnerGifts>{output}</InnerGifts>}
  </Container></OuterWrap>

}