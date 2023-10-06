// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   // let linkid:string = req.query.linkid as string;
    let { linkid:link } = req.query
    console.log("image.ts:", link)
    link=link as string;
    const linkid:string=link.split(".")[0];
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/get-metaimage?linkid=${linkid}`;
    console.log("image.ts:", url);
    const result = await axios.get(url);
    const {success,msg,metaimage} = result.data;
    console.log("image.ts",  linkid, success, metaimage);

    var img = new Buffer(metaimage.split(',')[1], 'base64');
    // console.log("metaimage:::::::::::::::::::::::::::::::::::::::::",metaimage);
    //console.log("image >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",img.length,img);
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': img.length 
    });
    res.end(img)
}
