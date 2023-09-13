import axios from 'axios';
import { Options } from './with-session';
import { getWishText, recordEvent } from "../lib/api";
export const generateText = async (session: Options,fresh:boolean) => {
    
    const { sessionid='',from='', to='', occasion='', naive=false, reflections='', instructions='', inastyleof='', language='' } = session;
     
    setTimeout(async ()=>await recordEvent(session.sessionid, 'generate',JSON.stringify({
        from,
        to,
        occasion,
        naive,
        reflections,
        instructions,
        inastyleof,
        language,
        fresh,
        sessionid,
      },null,4)),1000);
      console.log("handleGenerate====>",session);
      const {content:result,num} = await getWishText({
        style: "",
        from,
        to,
        occasion,
        naive,
        reflections,
        instructions,
        inastyleof,
        language,
        fresh,
        sessionid:session.sessionid,
      });
     
      console.log("handleGenerate=>", result,num);
      return {greeting:result,num}
     
}