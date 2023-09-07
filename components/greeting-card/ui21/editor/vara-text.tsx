import { useEffect, useState } from "react";
import Vara from "vara";

function VaraText({ text }: { text: string[] }) {
    const [v, setV] = useState<boolean>(false)
    let vara: any;
   // const tt = [text[0]];
    console.log("vara =>text:",text,typeof text)
    let delay=0;
    useEffect(() => {
       if(!delay){
        delay=1;
        console.log("use effect vara =>text:",text,typeof text) 
        setTimeout(() => {
            if (!v) {
                setV(true);
                vara = new Vara(
                    "#vara-container",
                    "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
                   // "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Shadows-Into-Light/shadows-into-light.json",
                    //"https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Pacifico/PacificoSLO.json",
                   // "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Parisienne/Parisienne.json",
                   
                    text.map((t) => {
                        console.log("vara text t:", t);
                        return {
                            text: t,
                            color: "#00F",
                            fontSize: 14,
                            lineHight: 2.8,
                            strokeWidth: 1.3,
                            marginTop:0,
                            textAlign: "center",
                        }
                    })

                );
                console.log("Render vara:", text)
            }
        }, delay);
    }
       
    }, [v,text]);
    return <div id="vara-container" className="z-[20]"></div>;
}
export default VaraText;