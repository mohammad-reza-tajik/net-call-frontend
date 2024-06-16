"use client"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useSignal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";

interface Props {
    devices?: MediaDeviceInfo[];
    text?: string;
}

function DeviceSelector({devices, text}: Props) {

    const device = useSignal("default");

    useSignals();

    if (!devices) {
        return
    }

    const changeDeviceHandler = async (value: string) => {
        try {

            const {deviceId, label, kind} = JSON.parse(value) as MediaDeviceInfo;

            device.value = label;

            if (!peerConnectionSignal.value) {
                throw new Error("no connection");
            }

            // change local stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: kind === "videoinput" ? {deviceId: {exact: deviceId}} : false,
                audio: kind === "audioinput" ? {deviceId: {exact: deviceId}} : false
            });

            const newLocalStream = new MediaStream();

            // send new local stream to the remote peer
            const sender = peerConnectionSignal.value.getSenders().find((sender) => sender.track?.kind === kind.slice(0, 6));

            if (kind === "videoinput") {
                const [videoTrack] = stream.getVideoTracks();
                newLocalStream.addTrack(videoTrack)
                localStreamSignal.value?.getAudioTracks().forEach((track) => {
                    newLocalStream.addTrack(track);
                })
                localStreamSignal.value = newLocalStream;
                await sender?.replaceTrack(videoTrack);
            } else if (kind === "audioinput") {
                const [audioTrack] = stream.getAudioTracks();
                newLocalStream.addTrack(audioTrack)
                localStreamSignal.value?.getVideoTracks().forEach((track) => {
                    newLocalStream.addTrack(track);
                })
                localStreamSignal.value = newLocalStream;
                await sender?.replaceTrack(audioTrack);
            }

        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className={"flex items-center gap-5"}>
            <p className={"text-sm"}>{text}</p>
            <Select onValueChange={changeDeviceHandler} defaultValue={device.value}>
                <SelectTrigger className={"w-36 md:w-44"}>
                    <SelectValue>
                        {device.value}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {
                        devices.map((item) => {
                            return (
                                <SelectItem value={JSON.stringify(item)} key={item.deviceId}>{item.label}</SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
        </div>
    )
}

export default DeviceSelector;