import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import Text from "../text";
import LineContainer from "../line-container";
const targets= [
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "wife", label: "Wife" },
    { value: "husband", label: "Husband" },
    { value: "love", label: "Love" },
    { value: "buddy", label: "Budy" },
    { value: "niece", label: "Niece" },
    { value: "nephew", label: "Nephew" },
    { value: "grandson", label: "Grandson" },
    { value: "granddaughter", label: "Granddaughter" },
    

    
   
  ];

export default function Input({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Text>*To </Text><Element  value={value} options={targets} onChange={onChange}/></LineContainer>

}