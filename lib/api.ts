import axios from 'axios';
import { Options } from './with-session';


export const getWishText = async ({ from, to, occasion, interests, age }: { from: string, to: string, occasion: string, interests: string, age: string }) => {
    from = encodeURIComponent(from || '');
    to = encodeURIComponent(to || '');
    occasion = encodeURIComponent(occasion || '');
    interests = encodeURIComponent(interests || '');
    age = encodeURIComponent(age || '');
    if (!from && !to && !occasion && !interests && !age)
        return '';
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/openai/wish-text?from=${from}&to=${to}&occasion=${occasion}&interests=${interests}&age=${age}`;
    console.log("url:", url);
    const res = await axios.get(url);
    return res.data.result;
}
export interface Item {
    title: string;
    price: string;
    image: string;
    link: string;
}
export const getAmazonSearch = async ({ search }: { search: string }) => {
    const url=`/api/amazon-search?search=${encodeURIComponent(search)}`;
    console.log("url:", url);
    const res = await axios.get(url);
    return res.data.items as Item[];
}
/**
 * User Session
 */
export const updateUserSession = async (userslug: string, options: Options) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/updateSession?`
    const res = await axios.post(url, {
       userslug,
       options
    });
    return res.data.userSession;
 }
 export const getUserSession = async (userslug: string) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetchSession?`
    const res = await axios.post(url, {
       userslug
    });
    return res.data.userSession;
 }
 