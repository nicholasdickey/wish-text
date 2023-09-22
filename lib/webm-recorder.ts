import MediaStreamRecorder from 'msr';
import {saveImage} from './api';
const microtime = () => Math.abs(new Date().getTime());
const webmRecord = async function WebmRecord(linkid:string,canvas: HTMLCanvasElement, seconds: number): Promise<string> {
    const promise: Promise<string> = new Promise((resolve, reject) => {
       
        let mediaRecorder: any;
        let recordedChunks: any[] = [];
        try {
            console.log("_dbg: start recording");
            const stream = canvas.captureStream(30);
            console.log("_dbg: captured stream", stream);
            mediaRecorder = new MediaRecorder(stream, {
             //  videoBitsPerSecond: 10000000,
                mimeType: 'video/webm'//'video/mp4; codecs=avc1.4d002a'//'video/webm;codecs=vp9',

            });
            recordedChunks = [];
            mediaRecorder.onstop = async (e:any) => {
                const blob = new Blob(recordedChunks, {
                    type: "video/webm"
                });
                console.log("_dbg: blob", blob  )
               // blobToDataURL(blob, function (dataurl: string) {
                    //const url = dataurl;
                  /*  const url = URL.createObjectURL(blob);
                    console.log("_dbg: url", url);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "recording.webm";
                    a.click();
*/
                    blobToDataURL(blob, async function (dataurl: string) {
                        const url = dataurl;
                        console.log("_dbg: url", url);
                       /* const a = document.createElement("a");
                        a.href = url;
                        a.download = "recordingData.webm";
                        a.click(); */
                        await saveImage({inputVideo:url,linkid}); 
                        resolve(dataurl);

                        //console.log(dataurl);
                    });
                    //resolve(url);// });
            }
            mediaRecorder.ondataavailable = (e: any) => {
                console.log("_dbg: ondataavailable", e.data.size);
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                  
                }
            };
            mediaRecorder.start();
            setTimeout(() => {
                console.log("_dbg: stop recording")
                mediaRecorder.stop();
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