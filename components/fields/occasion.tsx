import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import {Label,Input} from "../text";
import LineContainer from "../line-container";
const occasions= [
    { value: "birthday", label: "Birthday" },
    { value: "illness", label: "Illness" },
    { value: "wedding-anniversary", label: "Wedding Anniversary" },
    { value: "death", label: "Death" },
  ];
  
export default function Occasion({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Label>*On the occasion of </Label><Input type="text" id="occasion" name="occasion" required onChange={onChange} value={value}/>{false?<Element value={value} options={occasions} onChange={onChange}/>:null}</LineContainer>

}