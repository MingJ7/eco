"use client"
import { useEffect, useState } from "react"

function endStream(ms: MediaStream){
    ms.getTracks().forEach(track => {
        track.stop();
    });
}

function alertPermissionNeed(error: Error){
    console.log(error);
    alert("Camera permissions needed.")
}

function promptPermission(){
    return navigator.mediaDevices.getUserMedia({
        video: true
    }).then(endStream).catch(alertPermissionNeed);
}

export function handleError(error: Error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

export function MediaSelection({videoIn, setVideoIn}: {videoIn: string, setVideoIn: (arg0: string) => void}) {
    const [videoInDevices, setVideoInDevices] = useState(new Array<MediaDeviceInfo>())

    function gotDevices(deviceInfos: Array<MediaDeviceInfo>) {
        console.log("Got new list of devices")
        const newVideoList = new Array<MediaDeviceInfo>()
        for (let i = 0; i !== deviceInfos.length; ++i) {
            console.log("Device", i, deviceInfos[i].deviceId)
            // if (deviceInfos[i].deviceId === '') {
            //     promptPermission().then(() => navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError));
            //     return;
            // }
            const deviceInfo = deviceInfos[i];
            if (deviceInfo.kind === 'videoinput') {
                console.log('Video Input: ', deviceInfo);
                newVideoList.push(deviceInfo);
            } else {
                console.log('Some other kind of source/device: ', deviceInfo);
            }
        }
        setVideoInDevices(newVideoList);
        setVideoIn(newVideoList[0].deviceId)
    }

    useEffect(function startup(){
        console.log("Attempting to get new list of devices")
        navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
        return function cleanup(){}
    }, [])

    return (
        <div>
            <p>Choose Video Device</p>
            <select id='videoSelect' value={videoIn} onChange={evt => setVideoIn(evt.target.value)}>
                {
                    videoInDevices.map((device, idx) => (
                        <option value={device.deviceId} key={device.deviceId + idx}>{device.label || "Device #" + idx}</option>
                    ))
                }
            </select>
        </div>
    )
}