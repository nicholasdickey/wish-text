import axios from 'axios';
import { Options } from './with-session';
import CardData from "./card-data";
import ImageData from "./image-data"; 

// Retrieves wish text from the server
export const getWishText = async ({ style, from, to, occasion, naive, reflections, instructions, inastyleof, language, fresh, sessionid }: { style: string, from: string, to: string, occasion: string, naive: boolean, reflections: string, instructions: string, inastyleof: string, language: string, fresh?: boolean, sessionid?: string }): Promise<{ content: string, num: number }> => {
  try {
    console.log("getWishText!!!!!!!!!",occasion);
    // Encode the URL parameters
    from = encodeURIComponent(from || '');
    to = encodeURIComponent(to || '');
    occasion = encodeURIComponent(occasion || '');
    naive = naive || false;
    reflections = encodeURIComponent(reflections || '');
    instructions = encodeURIComponent(instructions || '');
    inastyleof = encodeURIComponent(inastyleof || '');
    language = encodeURIComponent(language || '');
    sessionid = encodeURIComponent(sessionid || '');
    fresh = fresh || false;

    if (!from && !to && !occasion)
      return { content: '', num: 0 };

    // Construct the URL
    let url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/openai/wish-text?sessionid=${sessionid}&from=${from}&to=${to}&occasion=${occasion}&naive=${naive}&reflections=${reflections}&instructions=${instructions}&inastyleof=${inastyleof}&language=${language}${fresh ? '&fresh=1' : ''}`;
     console.log("url:", url);

    let recovery = '';
    while (true) {
      try {
        if (recovery && recovery.length > 0) {
          url = url + recovery;
        }
        const res = await axios.get(url);
        return { content: res.data.result, num: res.data.num };
      } catch (x) {
        console.log("SLEEP", x);
        await new Promise(r => setTimeout(r, 1000));
        recovery = '&recovery=1';
      }
    }
  }
  catch (x) {
    console.log("getWishText", x);
    return { content: 'error', num: 0 };
  }
}

// Retrieves gift text from the server
export const getGiftsText = async ({ from, to, occasion, reflections, interests, fresh, sessionid }: { from: string, to: string, occasion: string, reflections: string, interests: string, fresh?: boolean, sessionid?: string }) => {
  try {
    // Encode the URL parameters
    from = encodeURIComponent(from || '');
    to = encodeURIComponent(to || '');
    occasion = encodeURIComponent(occasion || '');
    reflections = encodeURIComponent(reflections || '');
    interests = encodeURIComponent(interests || '');

    fresh = fresh || false;
    if (!from && !to && !occasion && !interests)
      return '';

    // Construct the URL
    let url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/openai/gifts-text?sessionid=${sessionid || ''}&from=${from}&to=${to}&occasion=${occasion}&reflections=${reflections}&interests=${interests}${fresh ? '&fresh=1' : ''}`;
    //  console.log("url:", url);

    let recovery = '';
    while (true) {
      try {
        if (recovery && recovery.length > 0) {
          url = url + recovery;
        }
        const res = await axios.get(url);
        return res.data.result;
      } catch (x) {
        console.log("SLEEP", x);
        await new Promise(r => setTimeout(r, 1000));
        recovery = '&recovery=1';
      }
    }
  }
  catch (x) {
    console.log("getGiftsText", x);
  }
}

export interface Item {
  title: string;
  price: string;
  image: string;
  link: string;
}

// Retrieves search results from Amazon
export const getAmazonSearch = async ({ search }: { search: string }) => {
  try {
    if (!search) return [];
    const url = `/api/amazon-search?search=${encodeURIComponent(search)}`;
    //console.log("url:", url);
    const res = await axios.get(url);
    return res.data.items as Item[];
  }
  catch (x) {
    //console.log("getAmazonSearch", x);
  }
}

/**
 * User Session
 */

// Updates the user session
export const updateUserSession = async (userslug: string, options: Options) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/update-session?`;
  const res = await axios.post(url, {
    userslug,
    options
  });
  return res.data.userSession;
}

// Retrieves the user session
export const getUserSession = async (userslug: string) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetch-session?`;
  const res = await axios.post(url, {
    userslug
  });
  return res.data.userSession;
}

// Updates the session
export const updateSession = async (sessionid: string, config: Options) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/session/update-session?`;
    //console.log("updateSession", url, sessionid, config);
    const res = await axios.post(url, {
      sessionid,
      config
    });
    return res.data.success;
  } catch (x) {
    // console.log("updateSession", x);
  }
}

// Fetches the session
export const fetchSession = async (sessionid: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/session/fetch-session?sessionid=${sessionid} `;
    const res = await axios.get(url);
    console.log("fetchSession", sessionid, res.data.session);
    return res.data.session;
  } catch (x) {
    console.log("fetchSession", x);
  }

}
// Fetches the session
export const fetchSharedImages = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/session/fetch-shared-images`;
    const res = await axios.get(url);
    // console.log("fetchSharedImages", res.data.session);
    if (res.data.success)
      return res.data.images;

  } catch (x) {
    console.log("fetchSession", x);
  }
  return [];
}

// Saves the wish text to history
export const saveToHistory = async (username: string, greeting: string, image: string, to: string, occasion: string, gift: string) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/upsert?username=${username}&greeting=${greeting}&image=${image}&to=${to}&occasion=${occasion}&gift=${gift}`;
  const res = await axios.get(url);
  console.log("saveToHistory", username, res.data.success);
  return res.data.success;
}

// Deletes history entry
export const deleteHistory = async (username: string, to: string, time: number) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/delete?username=${username}&to=${to}&time=${time}`;
  const res = await axios.get(url);
  console.log("saveToHistory", username, res.data.success);
  return res.data.success;
}

// Retrieves history entries
export const getHistories = async (username: string, page: number, pagesize: number) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/get?username=${username}&page=${page}&pagesize=${pagesize}`;
  const res = await axios.get(url);
  console.log("getHistories", username, res.data.success);
  return res.data;
}
// Records event
export const recordEvent = async (sessionid: string, name: string, params: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/events/record?sessionid=${encodeURIComponent(sessionid)}&name=${encodeURIComponent(name)}&params=${encodeURIComponent(params)}`;
    const res = await axios.get(url);
    return res.data.success;
  }
  catch (e) {
    console.log("recordEvent", e);
    return false;
  }
}
export const recordSessionHistory = async (sessionid: string, greeting: string, occasion: string, params: string) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/record-session-history?sessionid=${sessionid}`;
  const res = await axios.post(url, { sessionid, greeting, occasion, params });
  // console.log("recordSessionCard", sessionid, res.data.success,res.data);
  return res.data;
}
export const getSessionHistory = async (sessionid: string, num: number) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/get-session-history?sessionid=${sessionid}&num=${num}`;
  const res = await axios.get(url);
  // console.log("getSessionHistory", sessionid,num, res.data.success,res.data);
  return res.data;
}
export const deleteSessionHistories = async (sessionid: string) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/delete-session-histories?sessionid=${sessionid}`;
  const res = await axios.get(url);
  // console.log("deleteSessionHistories", sessionid, res.data.success,res.data);
  return res.data;
}
export const getSessionCards = async (sessionid: string, cardNum: number): Promise<{ success: boolean, record: CardData }> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/get-session-cards?sessionid=${sessionid}&cardNum=${cardNum}`;
  console.log("getSessionCards:", url);
  const res = await axios.get(url);
  console.log("getSessionCards", sessionid, cardNum, res.data.success, res.data);
  return res.data;
}
export const deleteSessionCards = async (sessionid: string) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/delete-session-cards?sessionid=${sessionid}`;
  const res = await axios.get(url);
  // console.log("deleteSessionCards", sessionid, res.data.success,res.data);
  return res.data;
}
export const recordSessionCard = async (sessionid: string, card: CardData):Promise<{success:boolean,cardNum:number,linkid:string}> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/record-session-card?sessionid=${sessionid}`;
  console.log("calling recordSessionCard:", url, card);
  const res = await axios.post(url, { card });
   console.log(">>>recordSessionCard", sessionid, res.data.success,res.data);
  return res.data;
}
export const addSessionImage = async (sessionid: string, image: ImageData): Promise<{ success: boolean, images: ImageData[] }> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/images/add-session-image?sessionid=${sessionid}`;
  const res = await axios.post(url, { image, sessionid });
  // console.         log("recordSessionCard", sessionid, res.data.success,res.data);
  return res.data;
}
export const fetchSessionImages = async (sessionid: string): Promise<{ success: boolean, images: ImageData[] }> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/images/fetch-session-images?sessionid=${sessionid}`;
  console.log("fetchSessionImages:", url);
  const res = await axios.get(url);
  // console.log("getSessionCards", sessionid,num, res.data.success,res.data);
  return res.data;
}
export const deleteSessionImages = async (sessionid: string) => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/images/delete-session-images?sessionid=${sessionid}`;
  const res = await axios.get(url);
  // console.log("deleteSessionCards", sessionid, res.data.success,res.data);
  return res.data;
}
export const getSharedCard = async (sessionid: string, id: string=''): Promise<{ success: boolean, card: CardData }> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/get-shared-card?sessionid=${sessionid}&id=${id}`;
  console.log("getSharedCard:", url);
  const res = await axios.get(url);
  console.log("getSessionCards", sessionid, id, res.data.success, res.data);
  return res.data;
}
export const getReport = async (): Promise<{ success: boolean, report: any }> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/events/report`;
  console.log("getReport:", url);
  const res = await axios.get(url);
 return res.data;
}
export const saveImage=async({linkid,inputVideo}:{linkid:string,inputVideo:string})=>{
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/cards/record-gif`;
  console.log("getReport:", url,linkid,inputVideo);
  const res = await axios.post(url,{linkid,inputVideo:inputVideo});
}



