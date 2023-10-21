import * as React from 'react';
import { withSessionSsr, Options } from '../lib/with-session';
import { isbot } from '../lib/isbot';
import WishCardLanding from '../components/landing/wish-card-landing';
import ReacterraLanding from '../components/landing/reacterra-landing';
import {
    GetServerSidePropsContext,
} from "next";
import { fetchSession, recordEvent, updateSession, deleteSessionHistories, getSessionHistory } from '../lib/api'
const landing=process.env.NEXT_PUBLIC_LANDING;
export default function Home({ dark, fresh, fbclid, utm_content, isbot, isfb, sessionid }:
    { dark: number, fresh: boolean, fbclid: string, utm_content: string, isbot: number, isfb: number, sessionid: string }) {
    return landing=="REACTERRA"?<ReacterraLanding dark={dark} fresh={fresh} fbclid={fbclid} utm_content={utm_content} isbot={isbot} isfb={isfb} sessionid={sessionid} />:<WishCardLanding dark={dark} fresh={fresh} fbclid={fbclid} utm_content={utm_content} isbot={isbot} isfb={isfb} sessionid={sessionid} />
}
export const getServerSideProps = withSessionSsr(
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {
            let { fbclid, utm_content, dark }:
                { fbclid: string, utm_content: string, dark: number } = context.query as any;

            utm_content = utm_content || '';

            fbclid = fbclid || '';
            const ua = context.req.headers['user-agent'];
            const botInfo = isbot({ ua });

            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            let sessionid = context.req.session?.sessionid || randomstring();
            const fresh = !context.req.session.sessionid;
            if (!botInfo.bot) {
                console.log('ssr-landing-init');
                try {
                    recordEvent(sessionid, 'ssr-landing-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-landing-init-error', x);
                }

            }
            if (botInfo.bot) {
                try {
                    await recordEvent(sessionid, 'ssr-bot-landing-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-bot-landing-init-error', x);
                }
            }
            if (fresh || context.req.session.sessionid != sessionid) {
                context.req.session.sessionid = sessionid;

                await context.req.session.save();
            }
            return {
                props: {
                    sessionid,
                    fresh,
                    fbclid,
                    utm_content,
                    isbot: botInfo.bot,
                    isfb: botInfo.fb || fbclid ? 1 : 0,
                    dark: dark || 0
                }
            }
        } catch (x) {
            console.log("FETCH SSR PROPS ERROR", x);
            context.res.statusCode = 503;
            return {
                props: { error: 503 }
            }
        }
    })
