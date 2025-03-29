"use client"
import { useEffect, useReducer, useRef, useState } from 'react';
import { handleError, MediaSelection } from './input';
import VideoPreview from './VideoPreview';
import { getMLResult } from './server';

export default function Component() {
    const [mediaStream, setMediaStream] = useState<undefined | MediaStream>();
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const resultsRef = useRef(null);
    const [videoIn, setVideoIn] = useState("");

    async function takePhoto() {
        if (videoRef.current && canvasRef.current) {
            const videoElement = videoRef.current as HTMLVideoElement;
            const canvasElement = canvasRef.current as HTMLCanvasElement;
            const ctx = canvasElement.getContext("2d");
            ctx?.drawImage(videoElement, 0, 0, width, height);

            const blob = (await new Promise(resolve => canvasElement.toBlob(resolve))) as unknown as Blob
            // canvasElement.toBlob(function (blob) {
            const formData = new FormData();
            formData.append('file', blob, 'filename.png');
            return getMLResult(formData).then((result) => {
                console.log(result)
                if (resultsRef.current) {
                    const resultsElement = resultsRef.current as HTMLCanvasElement;
                    const resultsCtx = resultsElement.getContext("2d");
                    resultsCtx?.drawImage(canvasElement, 0, 0, width, height);
                    resultsCtx!.font = "bold 48px serif"
                    result.boxes.forEach((bbox: Array<Array<number>>, idx: number) => {
                        const box = bbox[0]
                        // ctx!.lineWidth = 1
                        resultsCtx?.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1])
                        resultsCtx?.fillText(result.names[idx], box[0], box[1])
                    });
                }
            });
            // });
        }
    }

    function gotStream(stream: MediaStream) {
        setMediaStream(stream);
        if (stream && videoRef.current) {
            const videoElement = videoRef.current as HTMLVideoElement;
            videoElement.srcObject = stream;
            const streamSettings = stream.getVideoTracks()[0].getSettings();
            setWidth(streamSettings.width ?? 0)
            setHeight(streamSettings.height ?? 0)
            if (canvasRef.current) {
                const canvasElement = canvasRef.current as HTMLCanvasElement;
                canvasElement.width = streamSettings.width ?? 0;
                canvasElement.height = streamSettings.height ?? 0;
            }
            if (resultsRef.current) {
                const canvasElement = resultsRef.current as HTMLCanvasElement;
                canvasElement.width = streamSettings.width ?? 0;
                canvasElement.height = streamSettings.height ?? 0;
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

    function stop() {
        if (!mediaStream) return;
        mediaStream.getTracks().forEach(track => {
            track.stop();
        });
        setMediaStream(undefined)
    }

    useEffect(function doML(){
        if (!mediaStream) return
        let running = 1
        let promise = takePhoto()
        function temp(){
            if (running){
                promise = promise.then(async ()=>{
                    const newPromise = await takePhoto()
                    setTimeout(temp, 0)
                    return newPromise
                })
            }
        }
        temp()
        return function cleanup(){
            running = 0
        }
    }, [mediaStream, width, height])

    return (<div>
        <MediaSelection videoIn={videoIn} setVideoIn={setVideoIn} />
        <VideoPreview videoRef={videoRef} mediaStream={mediaStream} />
        <canvas ref={canvasRef} hidden style={{maxWidth: "100vw"}}/>
        <canvas ref={resultsRef} style={{maxWidth: "100vw"}}/>
        {mediaStream ? 
            <button onClick={stop}>Stop</button>
        :
            <button onClick={start}>Start</button>
        }
    </div>)
}
