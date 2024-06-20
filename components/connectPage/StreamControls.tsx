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
import DeviceSelector from "@/components/connectPage/DeviceSelector";
import ActionButton from "@/components/connectPage/ActionButton";
import localStreamSignal from "@/signals/localStream";
import remoteStreamSignal from "@/signals/remoteStream";
import statusSignal from "@/signals/peer/status";
import devicesSignal from "@/signals/devices";
import {isChatDrawerOpenSignal} from "@/signals/drawer";
import {chatChannelSignal, connectionStateSignal} from "@/signals/peer/peerConnection";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import hangup from "@/utils/hangup";
import {useSignal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";
import haveNewMessageSignal from "@/signals/haveNewMessage";
import {cn} from "@/lib/utils";

function StreamControls() {

    useSignals();

    const isMicMute = useSignal(false);
    const isVideoMute = useSignal(false);
    const isSoundMute = useSignal(false);

    if (connectionStateSignal.value !== "connected") {
        return
    }

    const muteMicHandler = () => {
        isMicMute.value = !isMicMute.value;
        localStreamSignal.value?.getAudioTracks().forEach(track => {
            track.enabled = !isMicMute.value;
        })
    }

    const muteVideoHandler = () => {
        isVideoMute.value = !isVideoMute.value;
        localStreamSignal.value?.getVideoTracks().forEach(track => {
            track.enabled = !isVideoMute.value;
        })
    }

    const muteSoundHandler = () => {
        isSoundMute.value = !isSoundMute.value;
        remoteStreamSignal.value?.getAudioTracks().forEach(track => {
            track.enabled = !isSoundMute.value;
        })
    }

    const hangupHandler = () => {
        socketSignal.value?.emit("hangupToServer", {localPeerId: localPeerIdSignal.value});
        hangup();
    }

    const openChatHandler = () => {
        isChatDrawerOpenSignal.value = true;
        haveNewMessageSignal.value = false;
        chatChannelSignal.value?.send("seen");
    }

    return (
        <div className={"flex justify-center items-center gap-5"}>
            <TooltipProvider>
                <ActionButton className={"bg-destructive text-destructive-foreground"}
                              icon={<Phone className={"size-7 rotate-[135deg]"}/>}
                              tooltipContent={"قطع تماس"}
                              handler={hangupHandler}/>

                <ActionButton
                    icon={isMicMute.value ? <MicrophoneOff className={"size-7"}/> : <Microphone className={"size-7"}/>}
                    tooltipContent={"قطع / وصل میکروفون"}
                    handler={muteMicHandler}/>

                {
                    statusSignal.value?.startsWith("video") || statusSignal.value === "screen:send" ?
                    <ActionButton
                        icon={isVideoMute.value ? <CameraOff className={"size-7"}/> : <Camera className={"size-7"}/>}
                        tooltipContent={"قطع / وصل تصویر"}
                        handler={muteVideoHandler}/> :
                        null
                }

                <ActionButton
                    icon={isSoundMute.value ? <SpeakerOff className={"size-7"}/> : <Speaker className={"size-7"}/>}
                    tooltipContent={"قطع / وصل صدا"}
                    handler={muteSoundHandler}/>

                <ActionButton className={cn({"animate-bounce": haveNewMessageSignal.value})}
                              icon={<Chat className={"size-7"}/>}
                              tooltipContent={"چت"}
                              handler={openChatHandler}/>

                <DeviceSelector devices={devicesSignal.value?.audioInputs} text={"میکروفون :"}/>

                {
                    statusSignal.value?.startsWith("video:") &&
                    <DeviceSelector devices={devicesSignal.value?.videoInputs} text={"وب کم :"}/>
                }

            </TooltipProvider>
        </div>
    )
}

export default StreamControls;