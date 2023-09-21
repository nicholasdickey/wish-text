import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from 'styled-components';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import html2canvas from "html2canvas";
import MediaStreamRecorder from 'msr';
// @ts-ignore
import GIF from 'gif.js.optimized';
import { isMainThread } from "worker_threads";
//import { Recorder, RecorderStatus, Encoders } from "canvas-record";
//import createCanvasContext from "canvas-context";
//import { AVC } from "media-codecs";
const Canvas = styled.canvas`
  display: none;
`;
const microtime = () => Math.abs(new Date().getTime());

interface Props {
    div: any;
}
//const isSSR = () => typeof window === 'undefined'; 
const RecorderContainer: React.FC<Props> = ({ div }) => {
    const [_div, setDiv] = useState<any>(div);
    const [started, setStarted] = useState<boolean>(false);
    if (!div)
        return <>NO DIV</>
    const [gif, setGif] = useState<GIF | null>(null);

    const [image, setImage] = useState<any | null>(null);
    const [recorder, setRecorder] = useState<any>(null);
    const [intervalHandle, setIntervalHandle] = useState<any>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [counter, setCounter] = useState<number>(0);
    const counterRef = useRef<number>(null);
    const intervalRef = useRef<any>(null);
    const [frames, setFrames] = useState<any[]>([]);
    const [childFrames, setChildFrames] = useState<any[]>([]);
    console.log("canvas render div", div, _div)
    let block = false;
    let done = false;
    const frameCount = 15 * 4; // Number of frames to capture
    const frameInterval = 50; // Interval between frame captures (in milliseconds)
    const frameRate = 15;
    const frameDelay = 1000 / frameRate;
    const gifRef = useRef();
    const timerStartRef = useRef<number>(null);
    const timerLastRef = useRef<number>(null);


    const childFramesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        //@ts-ignore
        gifRef.current = gif;// as GIF

    }, [gif])

    useEffect(() => {

        // let Recorder;
        if (div && !block) {
            block = true;
            //@ts-ignore
            counterRef.current = counter;

            console.log("canvas div", div.offsetWidth, div);
            setStarted(true);
            ctxRef.current = canvasRef.current?.getContext('2d') ?? null; // Ensure ctxRef.current is not undefined

            // @ts-ignore
            const gf = new GIF({
                workers: 2,
                quality: 10,
                repeat: 0,
                workerScript: "https://gist.github.com/karlcow/439e4640ad6335821b67d07eff9d300e.js"
            })
            console.log("_dbg:INITIAL GIF", gf);
            setGif(gf);
            /**
             * 
             * @param time 
             * @returns 
             */

            const step = async (time: number) => {
                if (!timerStartRef.current) {
                    //@ts-ignore
                    timerStartRef.current = time;
                    //@ts-ignore
                    timerLastRef.current = time;
                }
                const rtime = Math.round(time);
                //@ts-ignore
                const timeOffset = Math.round((time - timerLastRef.current));

                if (timeOffset > frameDelay) {
                    //@ts-ignore
                    timerLastRef.current += frameDelay;
                    console.log("_dbg:GENERATE FRAME", timeOffset, frameDelay, timerLastRef.current)
                    //@ts-ignore
                    counterRef.current++;
                    const id = 'frame-' + counterRef.current;
                    let cloneNode = div.cloneNode(true);
                    cloneNode.id = id;

                    //let attributes=[...div.attributes];
                    //attributes.id=id;
                    // div.attributes['id'] = id;
                    /* const clone = React.createElement(div.tagName,
                         {
                             id,
                             offsetWidth: div.offsetWidth,
                             offsetHeight: div.offsetHeight,
                             children: [...div.children],
                         })*/
                    // childFrames.push(cloneNode);
                    childFramesRef.current!.appendChild(cloneNode);
                    console.log("_dbg: after clone", cloneNode)
                    //setChildFrames([...childFrames]);

                    const frame = {
                        divid: id,
                        count: counterRef.current as number,
                        timeOffset: timeOffset,
                        time: time,

                    }
                    console.log("_dbg: adding frame", microtime(), frame);
                    frames.push(frame);
                    setFrames(frames);
                    /*
                     // capture image
                     canvasRef.current!.width = div.offsetWidth;
                     canvasRef.current!.height = div.offsetHeight;
                     // Clear the canvas before rendering
                     ctxRef.current!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                     console.log("_dbg: after clearRect",microtime())
                     const canvas = await html2canvas(div, {
                         useCORS: true,
                         logging: true,
                         width: div.offsetWidth,
                         height: div.offsetHeight,
                         scale: window.devicePixelRatio,
                     });
                     console.log("_dbg: after create canvas",microtime())
                     const imageUrl = canvas.toDataURL("image/svg", 1.0);
                     console.log("_dbg: after imageUrl",microtime())
                     */
                    const img = new Image();

                    console.log("_dbg: after clone", microtime(), cloneNode)
                    //console.log("_dbg: after new Image",microtime())

                    img.onload = () => {
                        // Render the image to the canvas
                        //  console.log("_DBG: onload", img)
                        ctxRef.current!.drawImage(img, 0, 0);

                        if (gifRef.current) {
                            //@ts-ignore
                            gifRef.current.addFrame(canvasRef.current!, { copy: true, delay: frameDelay }); // Adjust delay as needed
                        }

                        // Continue capturing frames until the desired count is reached

                        //@ts-ignore
                        /* if (gifRef.current && (gifRef.current.frames.length < frameCount)) {
                             //@ts-ignore
                             console.log('_dbg: Captured frame:', gifRef.current?.frames.length + 1);
                             //setTimeout(captureFrame, frameInterval);
                         } else if (gifRef.current) */

                    };
                    // img.src = imageUrl;
                    console.log("_dbg: canvas image", { img, imageUrl, complete: img.complete });
                    console.log("_dbg: counting", microtime(), counterRef.current, frameCount);
                    //@ts-ignore
                    if (counterRef.current > frameCount) {
                        // @ts-ignore
                        console.log(
                            '_dbg: Capture complete. Rendering final gif...'
                        )
                        if (false) {
                            console.log("_dbg: gif render");
                            done = true;

                            try {
                                //@ts-ignore                                  
                                gifRef.current.render();

                            }
                            catch (x) {
                                console.log("_dbg: gif render error", x);
                            }
                            setGif(gifRef.current);

                            console.log("_dbg:SET FINAL GIF", gifRef.current);
                            try {
                                //@ts-ignore
                                setImage(URL.createObjectURL(gifRef.current.blob));
                            }
                            catch (x) {
                                console.log("_dbg: gif blob error", x);
                            }


                            setStarted(false); // Set capturing to false when done
                            console.log('_dbg: Capture process complete. frames', frames);
                            return;
                            // clearInterval(intervalHandle);
                            // setIntervalHandle(null);
                        }
                        console.log('_dbg: Capture process complete. frames', microtime(), frames);
                        //now forget about the real time
                        //iterate frames, load images from canvas url, encode gif frames
                        setTimeout(async () => {
                            for (let i = 0; i < frames.length; i++) {
                                const frame = frames[i];
                                console.log("_dbg: rendergin frame", frame);
                                const divid = frame.divid;
                                console.log("_dbg: before get div", divid);
                                const div: HTMLDivElement = document.getElementById(divid) as HTMLDivElement;
                                console.log("_dbg: after get div", divid, div);
                                //document.body.appendChild(div);
                                canvasRef.current!.width = div.offsetWidth;
                                canvasRef.current!.height = div.offsetHeight;
                                // Clear the canvas before rendering
                                ctxRef.current!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                                console.log("_dbg: after clearRect", microtime())
                                const canvas = await html2canvas(div, {
                                    useCORS: true,
                                    logging: true,
                                    width: div.offsetWidth,
                                    height: div.offsetHeight,
                                    scale: window.devicePixelRatio,
                                });
                                console.log("_dbg: after create canvas", microtime())
                                const imageUrl = canvas.toDataURL("image/svg", 1.0);
                                console.log("_dbg: after imageUrl", i, microtime())

                                const img = new Image();

                                //  console.log("_dbg: after clone", i, microtime(), clone)
                                //console.log("_dbg: after new Image",microtime())

                                img.onload = () => {
                                    // Render the image to the canvas
                                    //  console.log("_DBG: onload", img)
                                    ctxRef.current!.drawImage(img, 0, 0);
                                    console.log("_dbg: after drawImage", i, microtime())
                                    if (gifRef.current) {
                                        //@ts-ignore
                                        gifRef.current.addFrame(canvasRef.current!, { copy: true, delay: frame.timeOffset });
                                        console.log("_dbg: after addFrame", i, microtime());
                                    }

                                    // Continue capturing frames until the desired count is reached

                                    //@ts-ignore
                                    /* if (gifRef.current && (gifRef.current.frames.length < frameCount)) {
                                         //@ts-ignore
                                         console.log('_dbg: Captured frame:', gifRef.current?.frames.length + 1);
                                         //setTimeout(captureFrame, frameInterval);
                                     } else if (gifRef.current) */

                                };
                                img.src = imageUrl;
                            }
                        }, 1000)

                        //now we should have the complete gif with all frames
                        try {
                            //@ts-ignore                                  
                            gifRef.current.render();
                        }
                        catch (x) {
                            console.log("_dbg: gif render error", x);
                        }
                        console.log("_dbg:SET FINAL GIF", gifRef.current);
                        setGif(gifRef.current);
                        try {
                            //@ts-ignore
                            setImage(URL.createObjectURL(gifRef.current.blob));
                        }
                        catch (x) {
                            console.log("_dbg: gif blob error", x);
                        }
                        return;


                    }
                }


                //  const t=microtime();
                //@ts-ignore
                console.log("_dbg:step:", time, counterRef.current, gifRef.current, gifRef.current?.frames.length);
                //@ts-ignore
                /* if (counterRef.current > frameCount) {
                     console.log("_dbg:step: counter > frameCount", counterRef.current, frameCount, intervalHandle, intervalRef.current);
                     
                     
                     
                     
                     return;
                     // clearInterval(intervalRef.current);
                     // setIntervalHandle(0);
                 }*/
                window.requestAnimationFrame(step);
                return;
                /*  if (ctxRef.current && div) {
                      canvasRef.current!.width = div.offsetWidth;
                      canvasRef.current!.height = div.offsetHeight;
                      // Clear the canvas before rendering
                      ctxRef.current!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  
                      const canvas = await html2canvas(div, {
                          useCORS: true,
                          logging: true,
                          width: div.offsetWidth,
                          height: div.offsetHeight,
                          scale: window.devicePixelRatio,
                      });
                      // capture image is div
                      // draw the image on canvas
                      // create gif frame from canvas
  
  
                      const imageUrl = canvas.toDataURL("image/svg", 1.0);
                      const img = new Image();
  
                      img.onload = () => {
                          // Render the image to the canvas
                          console.log("_DBG: onload", img)
                          ctxRef.current!.drawImage(img, 0, 0);
  
                          if (gifRef.current) {
                              //@ts-ignore
                              gifRef.current.addFrame(canvasRef.current!, { copy: true, delay: 100 }); // Adjust delay as needed
                          }
  
                          // Continue capturing frames until the desired count is reached
  
                          //@ts-ignore
                          if (gifRef.current && (gifRef.current.frames.length < frameCount)) {
                              //@ts-ignore
                              console.log('_dbg: Captured frame:', gifRef.current?.frames.length + 1);
                              //setTimeout(captureFrame, frameInterval);
                          } else if (gifRef.current) {
                              // @ts-ignore
                              console.log(
                                  '_dbg: Capture complete. Rendering final gif...'
                              )
                              if (!done) {
                                  console.log("_dbg: gif render");
                                  done = true;
  
                                  try {
                                      //@ts-ignore                                  
                                      gifRef.current.render();
                                  }
                                  catch (x) {
                                      console.log("_dbg: gif render error", x);
                                  }
                                  setGif(gifRef.current);
  
                                  console.log("_dbg:SET FINAL GIF", gifRef.current);
                                  try {
                                      //@ts-ignore
                                      setImage(URL.createObjectURL(gifRef.current.blob));
                                  }
                                  catch (x) {
                                      console.log("_dbg: gif blob error", x);
                                  }
                               
  
                                  setStarted(false); // Set capturing to false when done
                                  console.log('_dbg: Capture process complete. Clear Intervl');
                                  clearInterval(intervalHandle);
                                  setIntervalHandle(null);
                              }
                              else {
                                  console.log(
                                      '_dbg: Cler intervl'
                                  )
                                  clearInterval(intervalHandle);
                                  setIntervalHandle(null);
                              }
                          }
                      };
                      img.src = imageUrl;
                      console.log("_dbg: canvas image", { img, imageUrl, complete: img.complete });
                      
                  }
                  else {
                      console.log("_dbg: skipping canvas no ctx", { ctx: ctxRef.current, div });
                  }
                  */

            }
            const start = async () => {

                if (block)
                    return;
                block = true
                /*
                   const canvas = await html2canvas(div, {
                       useCORS: true,
                       logging: true,
                       width: div.offsetWidth,
                       height: div.offsetHeight,
                       scale: window.devicePixelRatio,
                   });
                   console.log("starting canvas", canvas, div.offsetWidth, div.offsetHeight)
                   const context = canvas.getContext('2d');
                   console.log("canvas context", context)
                   // const Recorder = (await import('canvas-record')).Recorder
                   const chunks: any = []; // here we will store our recorded media chunks (Blobs)
                   const stream = canvas.captureStream(); // grab our canvas MediaStream
                   stream.addEventListener('inactive', () => console.log("canvas stream inactive"));
                   stream.addEventListener('active', () => console.log("canvas stream active"));
   
                   console.log("canvas stream", stream);
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
                  
                  */
                /*  setRecorder(canvasRecorder);
      
                  await canvasRecorder.start();
                  setTimeout(async () => {
                      const image = await canvasRecorder.stop();
                      setImage(image as Uint8Array);
                  }, 4000)*/
            }
            // setTimeout(() => start().catch(console.error), 10)

            // const interval=setInterval(step, frameInterval);
            requestAnimationFrame(step);
            console.log("_dbg:STARTING INTERVAL");
            // setIntervalHandle(interval);
            // intervalRef.current = interval;
            // start().catch(console.error);
            /* return () => {
                 clearInterval(intervalHandle);
             }*/
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
    console.log("_dbg:RENDER", childFrames)
    return (
        <>
            <Canvas ref={canvasRef} />
            <img src={image} />
            <a href={`${image}`}>Download image</a>
            <img src={gif} />
            <div id="childframes" ref={childFramesRef}></div>
        </>
    )
}
export default RecorderContainer;