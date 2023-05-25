import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import {Label,Input} from "../text";
import LineContainer from "../line-container";
const names= [
    { value: "i", label: "I" },
    { value: "we", label: "We" },
   
  ];

export default function From({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Label>From </Label><Input type="text" id="to" name="to" required onChange={onChange} value={value}/>{false?<Element  value={value}  options={names} onChange={onChange}/>:null}</LineContainer>

}