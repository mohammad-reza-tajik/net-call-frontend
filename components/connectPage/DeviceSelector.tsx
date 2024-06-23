"use client"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useSignal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import localVideoRefSignal from "@/signals/localVideoRef";

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

            // send new local stream to the remote peer
            const sender = peerConnectionSignal.value.getSenders().find((sender) => {
                if (sender.track) {
                    /**
                     the label check is to make sure that the system audio is not the track that's being replaced
                     we want to mute the mic audio track
                     */
                    return kind.startsWith(sender.track.kind) && sender.track.label !== "System Audio";
                } else {
                    return false;
                }
            });

            if (kind === "videoinput") {
                const [videoTrack] = stream.getVideoTracks();
                if (localVideoRefSignal.value?.current) {
                    localVideoRefSignal.value.current.srcObject = stream;
                }
                await sender?.replaceTrack(videoTrack);
            } else if (kind === "audioinput") {
                const [audioTrack] = stream.getAudioTracks();
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
                                <SelectItem value={JSON.stringify(item)} key={item.deviceId}>
                                    {item.label}
                                </SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
        </div>
    )
}

export default DeviceSelector;