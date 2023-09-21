import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
// @ts-ignore
import GIF from 'gif.js';

const slideIn = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200px);
  }
`;

const AnimatedDiv = styled.div`
  width: 100px;
  height: 100px;
  background-color: blue;
  animation: ${slideIn} 3s linear infinite;

  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  font-size: 16px;
`;

const Canvas = styled.canvas`
  display: none;
`;

const CaptureButton = styled.button`
  margin-top: 10px;
`;

const DownloadGif = styled.div`
  display: none;
  margin-top: 10px;
`;

const DownloadLink = styled.a`
  text-decoration: none;
`;

function CaptureGif() {
  const [gif, setGif] = useState<GIF | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureFrame = () => {
    const animatedDiv = document.querySelector('.animated-div') as HTMLDivElement;
    // @ts-ignore
    if (ctxRef.current && animatedDiv) {
      canvasRef.current!.width = animatedDiv.offsetWidth;
      canvasRef.current!.height = animatedDiv.offsetHeight;

      // Clear the canvas before rendering
      ctxRef.current!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      // Create a data URI representing the HTML structure of the animated content
      const animatedContent = animatedDiv.outerHTML;
      const dataURI = 'data:image/svg+xml;base64,' + btoa(animatedContent);

      // Create an image from the data URI
      const img = new Image();
      console.log("_DBG: after new Image()", img);
      const onImgLoad=() =>{
        console.log("_DBG: onImgLoad", img);
      }
      img.onload=onImgLoad;
      const ol = () => {
        // Render the image to the canvas
        console.log("_DBG: onload", img)
        ctxRef.current!.drawImage(img, 0, 0);

        if (gif) {
          gif.addFrame(canvasRef.current!, { copy: true, delay: 100 }); // Adjust delay as needed
        }

        // Continue capturing frames until the desired count is reached

        //@ts-ignore
        if (gif && gif.frames.length < frameCount) {
          //@ts-ignore
          console.log('_dbg: Captured frame:', gif.frames.length + 1);
          setTimeout(captureFrame, frameInterval);
        } else if (gif) {
          // @ts-ignore
          gif.render();
          setGif(gif);

          const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;
          // @ts-ignore
          downloadLink.href = URL.createObjectURL(gif.blob);

          const downloadGif = document.getElementById('downloadGif') as HTMLDivElement;
          downloadGif.style.display = 'block';

          setIsCapturing(false); // Set capturing to false when done
          console.log('_dbg: Capture process complete.');
        }
      };
      img.src = dataURI;
      setTimeout(() => {
        console.log("_DBG: img.complete", img.complete);
        if(img.complete){
          ol();
        }
      }, 1000);
    };
  };
    useEffect(() => {
      // @ts-ignore
      ctxRef.current = canvasRef.current?.getContext('2d') ?? null; // Ensure ctxRef.current is not undefined

      // @ts-ignore
      setGif(
        new GIF({
          workers: 2,
          quality: 10,
          repeat: 0,
        })
      );
    }, []);

    const frameCount = 30; // Number of frames to capture
    const frameInterval = 100; // Interval between frame captures (in milliseconds)

    const handleCaptureButtonClick = () => {
      if (!isCapturing) {
        console.log('_dbg: Starting capture...');
        setIsCapturing(true);
        captureFrame();
      }
    };

    return (
      <>
        <AnimatedDiv className="animated-div">
          CSS Animated Content
        </AnimatedDiv>
        <Canvas ref={canvasRef} />
        <CaptureButton onClick={handleCaptureButtonClick} disabled={isCapturing}>
          {isCapturing ? '_dbg: Capturing...' : 'Capture as GIF'}
        </CaptureButton>
        {gif && (
          <DownloadGif id="downloadGif">
            <DownloadLink id="downloadLink" download="animated.gif">
              Download GIF
            </DownloadLink>
          </DownloadGif>
        )}
      </>
    );
  }
  

  export default CaptureGif;
