import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import Text from "../text";
import LineContainer from "../line-container";
const names= [
    { value: "i", label: "I" },
    { value: "we", label: "We" },
   
  ];

export default function Input({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Text>Optional From </Text><Element  value={value}  options={names} onChange={onChange}/></LineContainer>

}