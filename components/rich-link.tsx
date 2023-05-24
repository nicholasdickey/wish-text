import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 50px;
  margin-top: 50px;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding:50px;
`;

const RichLinkContainer = styled.a`
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: #fff;
  max-width:300px;
  max-height:300px;
 
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
`;

const Title = styled.h3`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 10px;
  background-color: rgba(32, 32, 32, 0.8);
`;

const Price = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 10px;
  color: #fff;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.6);
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
