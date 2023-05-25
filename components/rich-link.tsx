import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  //display: grid;
  //grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  //grid-gap: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
  margin-top: 50px;
 // border: 2px solid #ccc;
 // border-radius: 30px;
  //padding:50px;
`;

const RichLinkContainer = styled.a`
  display: flex;//inline-block;
  //justify-content: space-between;
  //position: relative;
  text-decoration: none;
  color: #fff;
  width:400px;
  max-height:300px;
  //border-radius: 30px;
  //align-items: flex-begin;
  background-color: #262644;
  align-items: center;
  border-radius: 30px;
  padding: 10px;
  margin: 20px;
`;

const Image = styled.img`
  //width: 100%;
  //height: auto;
  //max-height: 100px;
  //object-fit: cover;
  //position:absolute;
  left:0;
  top:0;
  height:100px;
  width:100px;
  //margin:10px;
  border-left: 2px solid #ccc;
  border-radius: 50%;
  
`;

const Title = styled.h3`
 //position: absolute;
  //top: 0;
  //right: 0;
  //margin: 0;
  flex-grow: 1;
  padding: 10px;
  height:100px;
  width:200px;
  font-size:14px;
  //background-color: rgba(32, 32, 32, 0.8);
`;

const Price = styled.p`
 // position: absolute;
 // top: 50%;
 // left: 50%;
 // transform: translate(-50%, -50%);
  //margin: 0;
 // padding: 10px;
 height:80px;
 width:50px;
 color: #fff;
  font-weight: bold;
 // background-color: rgba(0, 0, 0, 0.6);
`;

interface RichLinkProps {
  title: string;
  imageUrl: string;
  price: string;
  link: string;
}

export const RichLink: React.FC<RichLinkProps> = ({
  title,
  imageUrl,
  price,
  link,
}) => {
  return (
    <RichLinkContainer href={link}>
      <Image src={imageUrl} alt={title} />
      <Title>{title}</Title>
      <Price>{price}</Price>
    </RichLinkContainer>
  );
};

// Example usage:
/*const App: React.FC = () => {
  return (
    <div>
      <RichLink
        title="Example Product"
        imageUrl="https://example.com/image.jpg"
        price="$19.99"
        link="https://example.com/product"
      />
    </div>
  );
};
*/

//export default RichLink;
