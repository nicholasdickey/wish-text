import axios from 'axios';
import { Options } from './with-session';


export const getWishText = async ({ from, to, occasion, reflections, interests, age, fresh }: { from: string, to: string, occasion: string, reflections: string, interests: string, age: string, fresh?: boolean }) => {
    from = encodeURIComponent(from || '');
    to = encodeURIComponent(to || '');
    occasion = encodeURIComponent(occasion || '');
    reflections = encodeURIComponent(reflections || '');
    interests = encodeURIComponent(interests || '');
    age = encodeURIComponent(age || '');
    fresh = fresh || false;
    if (!from && !to && !occasion && !interests && !age)
        return '';
    let url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/openai/wish-text?from=${from}&to=${to}&occasion=${occasion}&reflections=${reflections}&interests=${interests}&age=${age}${fresh ? '&fresh=1' : ''}`;
    console.log("url:", url);
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
export interface Item {
    title: string;
    price: string;
    image: string;
    link: string;
}
export const getAmazonSearch = async ({ search }: { search: string }) => {
    if(!search) return [];
    const url = `/api/amazon-search?search=${encodeURIComponent(search)}`;
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
