import React, { useState, FormEvent } from "react";
import { styled } from "styled-components";

interface Props {
    disable?: boolean;
}
export default styled.label<Props>`
font-size: 18px;
margin-right: 40px;
margin-left:20px;
color:${props => props.disable ? "grey" : "inherit"};
`;
export const Label = styled.label<Props>`
font-size: 18px;
margin-right: 40px;
margin-left:20px;
margin-bottom: 10px;
color:${props => props.disable ? "grey" : "inherit"};
`;
export const Input = styled.input`
padding: 10px;
border: 1px solid #ccc;
border-radius: 4px;
width: 100%;
`;
export const TextArea = styled.textarea`
padding: 10px;
border: 1px solid #ccc;
border-radius: 4px;
width: 100%;
resize: vertical;
`;