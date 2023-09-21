import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from 'styled-components';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import html2canvas from "html2canvas";
import MediaStreamRecorder from 'msr';

//import { Recorder, RecorderStatus, Encoders } from "canvas-record";
//import createCanvasContext from "canvas-context";
//import { AVC } from "media-codecs";
interface Props {
    div: any;
}
//const isSSR = () => typeof window === 'undefined'; 
const RecorderContainer: React.FC<Props> = ({ div }) => {
    const [_div, setDiv] = useState<any>(div);
    const [started, setStarted] = useState<boolean>(false);
    if (!div)
        return <>NO DIV</>
    const [image, setImage] = useState<any | null>(null);
    const [recorder, setRecorder] = useState<any>(null);
    console.log("canvas render div", div, _div)
    let block = false;
    useEffect(() => {

        // let Recorder;
        if (div && !block) {
            console.log("canvas div", div.offsetWidth,div);
            setStarted(true);
            const start = async () => {

                if (block)
                    return;
                block = true
                const canvas = await html2canvas(div, {
                    useCORS: true,
                    logging: true,
                    width: div.offsetWidth,
                    height: div.offsetHeight,
                    scale: window.devicePixelRatio,
                });
                console.log("starting canvas", canvas,div.offsetWidth,div.offsetHeight)
                const context = canvas.getContext('2d');
                console.log("canvas context", context)
                // const Recorder = (await import('canvas-record')).Recorder
                const chunks: any = []; // here we will store our recorded media chunks (Blobs)
                const stream = canvas.captureStream(); // grab our canvas MediaStream
                stream.addEventListener('inactive', () => console.log("canvas stream inactive"));
                stream.addEventListener('active', () => console.log("canvas stream active"));
                
                console.log("canvas stream", stream );
                const rec = new MediaStreamRecorder(stream); // init the recorder
                console.log("canvas rec", rec);
                rec.mimeType = 'image/gif';
                rec.canvas = {
                    width: div.width,
                    height: div.height
                }
                //rec.videoWidth = div.width;
                //rec.videoHeight = div.height;
                //mediaRecorder.recorderType = GifRecorder;
                // every time the recorder has new data, we will store it in our array
                rec.ondataavailable = (blob: any) => {
                    console.log("canvas onDataAvailable");
                    block = false;
                    setStarted(false);
                    exportVid(blob);
                }
                rec.video = div;
                rec.onStartedDrawingNonBlankFrames = function () {
                    // record audio here to fix sync issues
                    rec.clearOldRecordedFrames(); // clear all blank frames
                    console.log("starting canvas drawing");
                    rec.start(3000);
                };
                //chunks.push(e.data) };
                // only when the recorder stops, we construct a complete Blob from all the chunks
                // rec.onstop = (e: any) => { block=false;setStarted(false);console.log("canvas onStop"); exportVid(new Blob(chunks, { type: 'image/gif' })) };
                console.log("canvas starting")
                setTimeout(() => { console.log("canvas stopping"); rec.stop() }, 4000); // stop recording in 3s

                rec.start(3000);
                /*const canvasRecorder = new Recorder(context, {
                   name: "canvas-record-example",
                   //@ts-ignore
                   extension: "gif",
       
                   
               });
               */
                /*  setRecorder(canvasRecorder);
      
                  await canvasRecorder.start();
                  setTimeout(async () => {
                      const image = await canvasRecorder.stop();
                      setImage(image as Uint8Array);
                  }, 4000)*/
            }
            setTimeout(() => start().catch(console.error), 10)
            // start().catch(console.error);
        }
        function exportVid(blob: any) {
            const vid = document.createElement('video');
            const url = URL.createObjectURL(blob);
            console.log("canvas exportVid:", blob)
            setImage(url);
            /* vid.controls = true;
             document.body.appendChild(vid);
             const a = document.createElement('a');
             a.download = 'myvid.gif';
             a.href = vid.src;
             a.textContent = 'download the video';*/
            //document.body.appendChild(a);
        }
        /*const interval = setInterval(async () => {
            await recorder.step();
        }, 33); */

        /*return () => {
            clearInterval(interval);
        }*/

    }, [div]);
    var imageUrl: string = '';
    /*if (image) {
        var arrayBufferView = image;//new Uint8Array(image as Uint8Array );
        var blob = new Blob([arrayBufferView], { type: "video/webm" });
        var urlCreator = window.URL || window.webkitURL;
        imageUrl = urlCreator.createObjectURL(blob);
    }*/
    function _arrayBufferToBase64(buffer: ArrayBuffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    return (
        <>
            <img src={image} />
            <a href={`${image}`}>Download image</a>
        </>
    )
}
export default RecorderContainer;