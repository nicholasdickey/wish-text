import MediaStreamRecorder from 'msr';
const microtime = () => Math.abs(new Date().getTime());
const webmRecord = async function WebmRecord(canvas: HTMLCanvasElement, frameRate: number, seconds: number): Promise<string> {
    const promise: Promise<string> = new Promise((resolve, reject) => {
        let timerStart: number;
        let timerLast: number;
        let counter = 0;
        const frameCount = frameRate * seconds; // Number of frames to capture
        const frameDelay = 1000 / frameRate;
        let req: number;
        let mediaRecorder: any;
        let recordedChunks: any[] = [];
        try {
            console.log("_dbg: start recording");
          //  const stream = new MediaStream(canvas.captureStream(25));
            const stream=canvas.captureStream(25)
            console.log("_dbg: captured stream", stream);
           //@ts-ignore
            mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'image/gif'; // this line is mandatory
            mediaRecorder.width = 320;
            mediaRecorder.height = 240;
            recordedChunks = [];
          /*  mediaRecorder.onstop = (e:any) => {
                const blob = new Blob(recordedChunks, {
                    type: "video/webm"
                });
                console.log("_dbg: blob", blob  )
               // blobToDataURL(blob, function (dataurl: string) {
                    //const url = dataurl;
                    const url = URL.createObjectURL(blob);
                    console.log("_dbg: url", url);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "recording.webm";
                    a.click();
                    resolve(url);// });
            }
            */
            mediaRecorder.ondataavailable = (blob:any) => {
              /*  console.log("_dbg: ondataavailable", e.data.size);
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                  
                }*/
                console.log("_dbg: ondataavailable", blob.size);
                const url = URL.createObjectURL(blob);
                console.log("_dbg: url", url);
                const a = document.createElement("a");
                a.href = url;
                a.download = "recording.webm";
                a.click();
                resolve(url);// });
            };
            mediaRecorder.start(seconds*1000);
            setTimeout(() => {
                console.log("_dbg: stop recording")
             //   mediaRecorder.stop();
              /*  setTimeout(() => {
                    const blob = new Blob(recordedChunks, {
                        type: "video/webm"
                    });
                    console.log("_dbg: blob", blob  )
                    blobToDataURL(blob, function (dataurl: string) {
                        const url = dataurl;
                        console.log("_dbg: url", url);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "recording.webm";
                        a.click();
                        resolve(dataurl);

                        //console.log(dataurl);
                    });
                }, 0);*/
                /* const url = URL.createObjectURL(blob);
                 console.log("_dbg: url", url);
                 const a = document.createElement("a");
                 a.href = url;
                 a.download = "recording.webm";
                 a.click();
                 //URL.revokeObjectURL(url);
                 return resolve(url)*/
            }, seconds * 1000);

        }
        catch (err) {
            reject(err);
        }
    })
    return promise;
}
export default webmRecord;

//**blob to dataURL**
//@ts-ignore
function blobToDataURL(blob, callback) {
    var a = new FileReader();
    //@ts-ignore
    a.onload = function (e) { callback(e.target.result); }
    a.readAsDataURL(blob);
}

//test:
//ar blob = dataURLtoBlob('data:text/plain;base64,YWFhYWFhYQ==');
//@ts-ignore
/*const blob="";
blobToDataURL(blob, function(dataurl:string){
    console.log(dataurl);
});*/