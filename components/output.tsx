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
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    margin-left:15px;
    margin-right:15px;
    
    `;
const InnerOutput = styled.h1`
  font-size: 14px;
  //margin-right: 90px;
 // margin-left:10px;
  margin-top:10px;
  width: 100%;
  min-height: 140px;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding:20px;
 // max-width: 800px;
  & p{
    margin-top:10px;
  }
`;
const InnerGifts = styled.h1`
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
function splitStringByNumberedSentences(input: string): string[] {
  const regex = /^\d+\.(.*?\.)/gm;
  const matches = input.match(regex);

  if (!matches) {
    return [];
  }

  return matches.map((match) => match.trim());
}
function extractDoubleQuotedPart(input: string): string {
  const regex = /"([^"]*)"/;
  const match = input.match(regex);

  if (match && match.length >= 2) {
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
    return { text: giftSuggestion, search: extractDoubleQuotedPart(giftSuggestion) };
  });
}
export default function Output({ session, updateSession, from, to, occasion, age, interests }: { session: Options, updateSession: any, from: string, to: string, occasion: string, age: string, interests: string }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState(session.greeting || '');
  const [giftSuggestions, setGiftSuggestions] = useState(session.giftSuggestions ? processGiftSuggestions(session.giftSuggestions) : Array<GiftSuggestion>());
  useEffect(() => {
    if (value) {
      const valueParts = value.split("Gift Suggestions:");
      setGreeting(valueParts[0]);
   

      const valueGiftSuggestions = valueParts[1];
      updateSession({ greeting: valueParts[0] ,giftSuggestions: valueGiftSuggestions });

      setGiftSuggestions(processGiftSuggestions(valueGiftSuggestions));

    }
  }, [value]);
  // generate code to parse the value for double quoted strings
  //  
  const output = greeting ? <>Gift Suggestions: {giftSuggestions.map((suggest: GiftSuggestion) => {
    return <div><AmazonIdeaSearch search={suggest.search} text={suggest.text} /></div>
  })}</> : null;

  return <div><ButtonContainer><Button loading={loading}><a onClick={async () => {
    if (loading)
      return;
    console.log("calling api with", from, to, occasion, age, interests);
    setLoading(true);
    const result = await getWishText({ from, to, occasion, age, interests });
    setLoading(false);
    console.log("result", result);
    setValue(result);
  }}>{value ? 'Try again' : 'Generate'}!</a></Button></ButtonContainer><Container><InnerOutput>
    <ReactMarkdown rehypePlugins={[rehypeRaw]} >{loading ? 'Generating...' : greeting}</ReactMarkdown>

  </InnerOutput> <InnerGifts>{output}</InnerGifts></Container></div>

}