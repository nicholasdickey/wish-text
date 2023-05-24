import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import Text from "../text";
import LineContainer from "../line-container";
const names= [
    { value: "boy", label: "Boy" },
    { value: "girl", label: "Girl" },
   
  ];

export default function Input({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Text>Optional Sex </Text><Element  value={value}  options={names} onChange={onChange}/></LineContainer>

}