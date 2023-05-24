import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import Element from "../element";
import Text from "../text";
import LineContainer from "../line-container";
    const age=()=>{
        let arr=[];
        for(let i=0;i<121;i++){
            arr.push({value:""+i,label:""+i});
        }
        return arr;
    }


export default function Input({value, onChange,disable}:{value:string,onChange:any,disable:boolean}) {

return <LineContainer><Text>Optional Age </Text><Element  value={value} options={age()} onChange={onChange} /></LineContainer>

}