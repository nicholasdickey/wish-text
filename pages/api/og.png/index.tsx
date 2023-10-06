import { ImageResponse } from 'next/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import ImageData from "../../../lib/image-data";

import { FC } from 'react';
import styled from 'styled-components';


export const config = {
  runtime: 'edge',
};

const ImageWrapper = styled.div<{ width: number; height: number }>`
  //display:flex;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  position: relative;
  overflow: hidden;
`;

const StyledImage = styled.img`
  //width: 100%;
  //height: 100%;
  object-fit: cover;
`;

const GradientOverlay = styled.div`
  //display:flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index:10;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
`;

const Title = styled.div`
 // display:flex;
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-size: 1.5rem;
  z-index: 100;

`;

interface ImageOverlayProps {
  imageUrl: string;
  width: number;
  height: number;
  title: string;
}

const ImageOverlay: FC<ImageOverlayProps> = ({ imageUrl, width, height, title }) => (
  <div style={{display:'flex',position:'relative',width:width,height:height,overflow:'hidden'}} >
   
  
  
  <img style={{zIndex:"0",position:'absolute',objectFit:'cover'}} src={imageUrl} alt={title} />
    
  
    {true&&<div style={{ position: "absolute",display:'flex',
  bottom: height/2-10,
  left: width/2-40,
  
  
  color: "white",
  fontSize: 24,
  textAlign:"center",
  zIndex: "100"
  }}>WWW.WISH-TEXT.COM</div>}
  
  </div>
);

export default async (
  req: NextApiRequest,
  res: NextApiResponse) => {
  try {
  
    const { searchParams } = new URL(req?.url||"");
    const link = searchParams.get('linkid')||''
    const linkid:string=link.split(".")[0];
    console.log("og:image gen linkid:",linkid)
    const emptyImage: ImageData = {
      url: '',
      publicId: '',
      height: 0,
      width: 0,
      thumbnailUrl: '',
      original_filename: ''
    };
    var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let sessionid = randomstring();
    console.log("before")
    const fetchurl = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/get-shared-card?sessionid=${sessionid}&id=${linkid}`;
    console.log("getSharedCard:", fetchurl);
    
    const response = await fetch(fetchurl);
    const data = await response.json();
    //const data = await getSharedCard(sessionid, linkid);
    console.log("getSharedCard:",data);
    let image: ImageData = emptyImage;
    let greeting="";
    if (data?.success) {
       image=data.card.image;
       greeting=data.card.greeting||"";
       const headline=JSON.parse(greeting).headline;
       const {url,width,height}=image;
       return new ImageResponse(<ImageOverlay imageUrl={url} width={width} height={height} title={headline}/>, {
        width,
        height,
      });
    }

    return new ImageResponse(<div style={{display:'flex'}}>No Image</div>, {
        width: 1200,
        height: 600,
      });
  } catch {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};

