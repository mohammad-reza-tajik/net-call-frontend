"use client"
import {TooltipProvider} from "@/components/ui/tooltip";
import {
    Microphone,
    MicrophoneOff,
    CameraOff,
    Camera,
    Speaker,
    SpeakerOff,
    Phone, Chat
} from "@/components/shared/Icons";
// import DeviceSelector from "@/components/connectPage/DeviceSelector";
import ActionButton from "@/components/connectPage/ActionButton";
import {useState} from "react";
import localStreamSignal from "@/signals/localStream";
import remoteStreamSignal from "@/signals/remoteStream";
import statusSignal from "@/signals/peer/status";
// import devicesSignal from "@/signals/devices";
import {isChatDrawerOpenSignal} from "@/signals/drawer";
import {chatChannelSignal} from "@/signals/peer/peerConnection";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import hangup from "@/utils/hangup";

function StreamControls() {

    const [muteMic, setMuteMic] = useState(false);
    const [muteVideo, setMuteVideo] = useState(false);
    const [muteSound, setMuteSound] = useState(false);

    if (!statusSignal.value) {
        return
    }

    const muteMicHandler = () => {
        setMuteMic((prevState) => !prevState);
        localStreamSignal.value?.getAudioTracks().forEach(track => {
            track.enabled = muteMic;
        })
    }

    const muteVideoHandler = () => {
        setMuteVideo((prevState) => !prevState);
        localStreamSignal.value?.getVideoTracks().forEach(track => {
            track.enabled = muteVideo;
        })
    }

    const muteSoundHandler = () =>  {
        setMuteSound((prevState) => !prevState);
        remoteStreamSignal.value?.getAudioTracks().forEach(track => {
            track.enabled = muteSound;
        })
    }

    const hangupHandler = () => {
        socketSignal.value?.emit("hangupToServer", {localPeerId : localPeerIdSignal.value});
        chatChannelSignal.value?.send("hangup");
        hangup();
    }

    return (
        <div className={"flex justify-center items-center gap-5"}>
            <TooltipProvider>
                <ActionButton className={"bg-destructive text-destructive-foreground"}
                              icon={<Phone className={"size-7 rotate-[135deg]"}/>}
                              tooltipContent={"قطع تماس"}
                              handler={hangupHandler}/>

                <ActionButton
                    icon={!muteMic ? <Microphone className={"size-7"}/> : <MicrophoneOff className={"size-7"}/>}
                    tooltipContent={muteMic ? "وصل میکروفون" : "قطع میکروفون"}
                    handler={muteMicHandler}/>

                {
                    statusSignal.value?.startsWith("video") || statusSignal.value === "screen:send" &&
                    <ActionButton icon={!muteVideo ? <Camera className={"size-7"}/> : <CameraOff className={"size-7"}/>}
                                  tooltipContent={muteVideo ? "وصل تصویر" : "قطع تصویر"}
                                  handler={muteVideoHandler}/>
                }

                <ActionButton icon={!muteSound ? <Speaker className={"size-7"}/> : <SpeakerOff className={"size-7"}/>}
                              tooltipContent={muteSound ? "وصل صدا" : "قطع صدا"}
                              handler={muteSoundHandler}/>

                <ActionButton icon={<Chat className={"size-7"} />} tooltipContent={"چت"} handler={()=>{
                    isChatDrawerOpenSignal.value = true
                }} />

                {/*<DeviceSelector devices={devicesSignal.value?.audioInputs} text={"میکروفون :"}/>

                {
                    statusSignal.value?.startsWith("video:") &&
                    <DeviceSelector devices={devicesSignal.value?.videoInputs} text={"وب کم :"}/>
                }*/}

            </TooltipProvider>
        </div>
    )
}

export default StreamControls;