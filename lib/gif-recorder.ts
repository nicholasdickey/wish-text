//@ts-ignore
import GIF from 'gif.js';
const microtime = () => Math.abs(new Date().getTime());
const gifRecord = async function GifRecord(canvas: HTMLCanvasElement, frameRate: number, seconds: number): Promise<string> {
    const promise: Promise<string> = new Promise((resolve, reject) => {
        let timerStart: number;
        let timerLast: number;
        let counter = 0;
        const frameCount = frameRate * seconds; // Number of frames to capture
        const frameDelay = 1000 / frameRate;
        let req:number;
        console.log("_dbg:START GIF RECORD", { frameDelay, frameRate, seconds, frameCount });
        try {

            const gif = new GIF({
                workers: 2,
                quality: 10,
                repeat: 0,
                workerScript: "https://dev.qwiket.com/gif.worker.js"
            })
            console.log("_dbg:CREATED INITIAL GIF", gif);
            gif.on('finished', function (blob: any) {

                const url = URL.createObjectURL(blob);
                console.log("_dbg:FINISHED GIF", blob, url);
                return resolve(url);
            });
            const step = async (time: number) => {
                if (!timerStart) {
                    timerStart = time;
                    timerLast = time;
                }
                const rtime = Math.round(time);

                const timeOffset = Math.round((time - timerLast));
               // console.log("_dbg:STEP", {timeOffset});
                if (timeOffset >= frameDelay) {
                    //@ts-ignore
                    timerLast += frameDelay;
                    console.log("_dbg:GENERATE FRAME", { timeOffset, frameDelay, timerLast })
                    //@ts-ignore
                    counter++;
                    //  const canvas = canvasRef.current;
                    const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
                    //console.log("_dbg: context", context);
                    //    console.log("_dbg: before Promise", microtime(), counter);
                    /* const promise= ():Promise<number>=>{
                          return new Promise<number>((resolve,reject)=>{
                             
                              const t1=microtime();
                              console.log("_dbg: before add frame", t1, counter)
                              gif.addFrame(canvas, { copy: false, delay: timeOffset });
                              console.log("_dbg: after add frame", microtime()-t1, counter)
                              return resolve(counter);
                             
                          })
                      }
                      console.log("_dbg: before promise()", microtime(), counter);
                      const p=promise();
                      console.log("_dbg: before p.then",p, microtime(), counter);
                      */
                    const t1 = microtime();
                    // console.log("_dbg: before add frame", timeOffset, counter)
                    gif.addFrame(canvas, { copy: true, delay: Math.max(20/*timeOffset/8*/,25) });
                    console.log("_dbg: after add frame", microtime() - t1, counter)
                    // p.then((c:number)=>{
                    //   console.log("_dbg: inside p.then",microtime(), counter);
                    if (counter > frameCount) {
                        /* console.log(
                             '_dbg: Capture complete. Rendering final gif...'
                         )*/

                        try {
                            gif.render();
                            console.log("_dbg: after render", microtime(), counter);

                        }
                        catch (x) {
                            console.log("_dbg: gif render error", x);
                        }

                    }
                    // });
                    // console.log("_dbg: moving on", microtime(), counter);

                    if (counter > frameCount) {
                        cancelAnimationFrame(req);



                        console.log("_dbg:SET FINAL GIF");
                        return;
                        /* try {
                             //@ts-ignore
                             setImage(URL.createObjectURL(gifRef.current.blob));
                         }
                         catch (x) {
                             console.log("_dbg: gif blob error", x);
                         }*/
                    }
                    else {
                        req=requestAnimationFrame(step);
                    }
                }
                else {
                    req=requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        }
        catch (err) {
            reject(err);
        }
    })
    return promise;
}
export default gifRecord;