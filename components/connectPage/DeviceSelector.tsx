"use client"
import {useSignal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import localVideoRefSignal from "@/signals/localVideoRef";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Caret} from "@/components/shared/Icons";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";

interface Props {
    devices?: MediaDeviceInfo[];
}

function DeviceSelector({devices}: Props) {

    const device = useSignal("default");

    useSignals();

    if (!devices) {
        return
    }

    const changeDeviceHandler = async (value: string) => {
        try {

            device.value = value;

            const deviceInfo = devices.find((mediaDevice) => mediaDevice.deviceId === value);

            if (!deviceInfo) {
                throw new Error("device not found");
            }

            const {kind} = deviceInfo;

            if (!peerConnectionSignal.value) {
                throw new Error("no connection");
            }

            // change local stream
            if (kind.endsWith("input")) {

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: kind === "videoinput" ? {deviceId: {exact: value}} : false,
                    audio: kind === "audioinput" ? {deviceId: {exact: value}} : false
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
            } else {
                // we want to change the speaker
                if (remoteVideoRefSignal.value?.current) {
                    await remoteVideoRefSignal.value.current.setSinkId(value);
                }
            }

        } catch (err) {
            console.error(err);
        }

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={"icon"} className={"rounded-none"}>
                    <Caret className={"-rotate-90"}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup value={device.value} onValueChange={changeDeviceHandler}>
                    {
                        devices.map((item) => {
                            return (
                                <DropdownMenuRadioItem key={item.deviceId} value={item.deviceId}>
                                    {item.label}
                                </DropdownMenuRadioItem>
                            )
                        })
                    }
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DeviceSelector;