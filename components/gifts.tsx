import React, { useState, FormEvent, useEffect } from "react";
import { styled } from "styled-components";
import Element from "./element";
import { getGiftsText } from "../lib/api";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import AmazonIdeaSearch from "./amazonIdeaSearch";
import { Options } from "../lib/with-session";
import AdIntro from "./ad-intro";
import Select from 'react-select';
import FormField from "./form-field";

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
const OuterWrap = styled.div`
`;
const GiftSuggesstionHeader = styled.div`
text-align:center;
margin-bottom:10px;
margin-top:50px;
`
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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top:40px;
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
interface GiftSuggestion {
    text: string;
    search: string;
}
const processGiftSuggestions = (valueGiftSuggestions: string) => {
    const giftSuggestionsParts = splitStringByNumberedSentences(valueGiftSuggestions);

    return giftSuggestionsParts.map((giftSuggestion, index) => {
        giftSuggestion = giftSuggestion.replaceAll("Amazon search:", "");
        return { text: giftSuggestion, search: extractDoubleQuotedPart(giftSuggestion) };
    });
}

export default function Output({ loadReady, session, updateSession2, from, to, occasion, reflections, interests, onInterestsChange }: { loadReady: boolean, session: Options, updateSession2: any, from: string, to: string, occasion: string, reflections: string, interests: string, onInterestsChange: any }) {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);



    const [giftSuggestions, setGiftSuggestions] = useState(session.giftSuggestions ? processGiftSuggestions(session.giftSuggestions) : Array<GiftSuggestion>());
    console.log("GIFT SUGGESTIONS:", value, 'giftSuggestions', giftSuggestions);
    // generate code to parse the value for double quoted strings
    //  
    const output = !loading&&value ? <><GiftSuggesstionHeader><h1>Gift Suggestions:</h1></GiftSuggesstionHeader><div> {giftSuggestions.map((suggest: GiftSuggestion, i: number) => {
        // if (i >0)
        //   return null;
        console.log("suggest", suggest, 'i', i)
        return <AmazonIdeaSearch key={`amazon-idea-search-${i}`} search={suggest.search} text={suggest.text} />
    })}</div></> : null;
    console.log("generated output",output)
    useEffect(() => {
        console.log("INSIDE LOAD EFFECT",loadReady, value)
        if (loadReady && !value){
            console.log("calling load   ")
            load();
        }
    }, [from, to, occasion, reflections, interests, loadReady, value]);
    const load = async () => {
        console.log("calling GIFT api with", from, to, occasion, reflections, interests);
        setLoading(true);
        const result = await getGiftsText({ from, to, occasion, reflections, interests, fresh: value ? true : false });
        setLoading(false);
        console.log("result", result, 'value:', value);
        if (result != value) {
            console.log("setting value", result)

            // setGiftsText(result);
            const valueGiftSuggestions = result;
            updateSession2({ giftSuggestions: valueGiftSuggestions });
            console.log("Gift Button returned", { giftSuggestions: valueGiftSuggestions })

            setGiftSuggestions(processGiftSuggestions(valueGiftSuggestions));
            console.log("setting after processGiftSuggestions", processGiftSuggestions(valueGiftSuggestions));
            setValue(result);
        }
    }
    console.log("ready to display",output);
    return <OuterWrap>
        {value ?  <FormContainer>
            <FormField value={interests} label="Additional Gift Selection Considerations" onChange={onInterestsChange} help="For example: &ldquo;a middle-aged woman, likes square dancing, horse riding, sparkling wine.&rdquo;, &ldquo;a 16 year-old girl who likes music.&rdquo; &ldquo; Christian familiy man, loves fishing and hunting&ldquo;" />


           <ButtonContainer><Button loading={loading}><a onClick={async () => {

                if (loading)
                    return;
                await load();
            }}>{value ? 'Re-generate Gifts Suggestions' : 'Update Gift Suggestions'}!</a></Button>


            </ButtonContainer> 
        </FormContainer>: null}
        <Container>


            {loading ? <GeneratingPlaceholder>We are generating the gift suggestions for you. Unfortunately, the AI is an expensive, and a limited availability resource, and it takes time.</GeneratingPlaceholder> :
                <InnerGifts>{output}</InnerGifts>}

        </Container> </OuterWrap>

}