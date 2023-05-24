import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import Text from "../text";
import LineContainer from "../line-container";
const interests= [
    { value: "music", label: "Music" },
    { value: "shooting", label: "Shooting" },
    { value: "horses", label: "Horses" },
    { value: "cats", label: "Cats" },
    { value: "dogs", label: "Dogs" },
    { value: "math", label: "Math" },
    { value: "reading", label: "Reading" },
   
  ];

export default function Input({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Text>Optional Interests </Text><Element  value={value} options={interests} onChange={onChange}/></LineContainer>

}