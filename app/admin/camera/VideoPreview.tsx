"use client"
import { RefObject, useEffect, useState } from "react";

export default function VideoPreview ({mediaStream, videoRef}: {mediaStream: MediaStream | undefined, videoRef: RefObject<null | HTMLVideoElement>}){
    const [preview, setPreview] = useState(false);
    const [muted, setMuted] = useState(true);

    useEffect(function updatePreview(){
        console.log("Update Preview", mediaStream)
        if (mediaStream) {
            const videoElement = videoRef.current;
            if (videoElement){
                videoElement.srcObject = mediaStream;
                videoElement.play();
            }
            console.log("EffectVideo", videoElement);
        }
        return function cleanup() {}
    }, [mediaStream, videoRef])

    return (
        <div>
            <video id='videoPreview' className='videoPreview' autoPlay={true} hidden={!preview} ref={videoRef} muted={muted}></video>
            <div hidden>
                Muted <input type="checkbox" checked={muted} onChange={(evt) => setMuted(evt.target.checked)} />&emsp;
            </div>
            <button className="btn green" onClick={() => setPreview(!preview)}>{preview ? "Hide Video" : "Display Video"}</button>
        </div>
    )
}
