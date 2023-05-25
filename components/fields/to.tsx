import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import {Label,Input} from "../text";
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

export default function To({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Label>To </Label><Input type="text" id="to" name="to" required onChange={onChange} value={value}/>{false?<Element  value={value} options={targets} onChange={onChange}/>:null}</LineContainer>

}