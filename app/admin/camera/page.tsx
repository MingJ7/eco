"use client"
import { useEffect, useReducer, useRef, useState } from 'react';
import { handleError, MediaSelection } from './input';
import VideoPreview from './VideoPreview';
import { getMLResult } from './server';

export default function Component() {
    const [mediaStream, setMediaStream] = useState<undefined | MediaStream>();
    const [interval, setMyInterval] = useState<undefined | NodeJS.Timeout>();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [videoIn, setVideoIn] = useState("");

    let width = 0;
    let height = 0;

    function takePhoto() {
        if (videoRef.current && canvasRef.current){
            const videoElement = videoRef.current as HTMLVideoElement;
            const canvasElement = canvasRef.current as HTMLCanvasElement;
            const ctx = canvasElement.getContext("2d");
            console.log(width, height)
            ctx?.drawImage(videoElement, 0, 0, width, height);

            const data = canvasElement.toDataURL("image/jpg", 0.8)
            document.getElementById("Testimg")!.src = data

            canvasElement.toBlob(function(blob) {
                const formData = new FormData();
                formData.append('file', blob, 'filename.png');
                getMLResult(formData);
            });
        }
    }
    
    function gotStream(stream: MediaStream) {
        setMediaStream(stream);
        if (stream && videoRef.current){
            const videoElement = videoRef.current as HTMLVideoElement;
            videoElement.srcObject = stream;
            if (canvasRef.current){
                const streamSettings = stream.getVideoTracks()[0].getSettings();
                const canvasElement = canvasRef.current as HTMLCanvasElement;
                canvasElement.width = width = streamSettings.width ?? 0;
                canvasElement.height = height = streamSettings.height ?? 0;
                setMyInterval(setInterval(takePhoto, 5000));
            }
        }
        console.log("new Stream", stream)
    }

    function start() {
        stop()
        const videoSource = videoIn;
        const constraints: any = {
            video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };
        console.log(constraints);
        navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
    }

    function stop(){
        if (interval != undefined) {
            clearInterval(interval)
        }
        if (!mediaStream) return;
        mediaStream.getTracks().forEach(track => {
            track.stop();
        });
        setMediaStream(undefined)
    }

    return (<div>
        <MediaSelection videoIn={videoIn} setVideoIn={setVideoIn}/>
        <VideoPreview videoRef={videoRef} mediaStream={mediaStream} />
        <canvas hidden ref={canvasRef} />
        {mediaStream ? 
            <button onClick={stop}>Stop</button>
        :
            <button onClick={start}>Start</button>
        }
        <img id="Testimg"/>
    </div>)
}
