import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";

interface Props{
    disable?:boolean;
}
export default styled.div<Props>`
font-size: 18px;
margin-right: 40px;
margin-left:20px;
color:${props=>props.disable?"grey":"inherit"};
`;