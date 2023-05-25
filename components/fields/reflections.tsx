import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";

import {Label,TextArea} from "../text";

const Container=styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items:flex-start;
//padding-left:20px;
margin-bottom: 10px;

`;
export default function Reflections({value,onChange}:{value:string,onChange:any}) {

return <Container><Label>Additional reflections and thoughts </Label>
<TextArea  id="reflections" name="reflections"  onChange={onChange} value={value}/>
</Container>

}