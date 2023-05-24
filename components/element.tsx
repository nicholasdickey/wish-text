import React,{useState,FormEvent} from "react";
import { styled } from "styled-components";
import CreatableSelect from 'react-select/creatable';
const ElementContainer = styled.div`
  
   color:black;
   //margin-right:20px;
   min-width:200px;
    `;


const Element= ({value,options,onChange,disable}:{value:string, options:{value:string,label:string}[],onChange:any,disable?:boolean})=> {
    const [opened,setOpened] = useState(false);
    //  const [choice,setChoice] = useState(choices[0]);
    console.log("value",value,"options",options);
    return (
      <>
  <ElementContainer><CreatableSelect  value = {
       options.filter(option => 
          option.label === value)
    } options={options} onChange={onChange}  isDisabled={disable}/></ElementContainer></>
  );
}
export default Element;