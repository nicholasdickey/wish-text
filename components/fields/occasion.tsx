import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import Text from "../text";
import LineContainer from "../line-container";
const occasions= [
    { value: "birthday", label: "Birthday" },
    { value: "illness", label: "Illness" },
    { value: "wedding-anniversary", label: "Wedding Anniversary" },
    { value: "death", label: "Death" },
  ];

export default function Input({value,onChange}:{value:string,onChange:any}) {

return <LineContainer><Text>*On the occasion of </Text><Element value={value} options={occasions} onChange={onChange}/></LineContainer>

}