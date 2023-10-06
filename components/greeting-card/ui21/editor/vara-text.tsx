import { useEffect, useState } from "react";
import styled from "styled-components";
import Vara from "vara";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
    large?: boolean;
    mobile?: boolean;
    length?: number;
}
const Outer = styled.div<Props>`
    width:100%;
    min-height:${({large,mobile,length})=>large?200:0}px;
    `;
function VaraText({ text, id }: { text: string[], id: string }) {
    const [v, setV] = useState<boolean>(false)
    let vara: any;
    const large=id.indexOf("popout") >= 0?true:false;    
    console.log("vara =>text:", text, typeof text)
    let delay = 0;
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log("vara:", text, id, mobile)
    useEffect(() => {
        if (!delay) {
            delay = 1;
            console.log("use effect vara =>text:", text, typeof text)
         //   setTimeout(() => {
                if (!v) {
                    setV(true);
                    vara = new Vara(
                        `#vara-container-${id}`,
                        "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
                        // "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Shadows-Into-Light/shadows-into-light.json",
                        //"https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Pacifico/PacificoSLO.json",
                        // "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Parisienne/Parisienne.json",

                        text.map((t, i) => {
                            console.log("vara text t:", t);
                            return {
                                text: t,
                                color: "#00F",
                                fontSize:large?mobile?18:16: mobile ? 9 : 14,
                                y: 9 * (i ? i : 0),
                                lineHight: mobile ? 1 : 2.8,
                                strokeWidth: 1.3,
                                marginTop: 0,
                                textAlign: "center",
                            }
                        })
                    );
                    console.log("Render vara:", text)
                }
          //  }, delay);
        }

    }, [v, text]);
    return <Outer large={large} mobile={mobile} length={text.length} id={`vara-container-${id}`} className="z-[20]"></Outer>;
}
export default VaraText;