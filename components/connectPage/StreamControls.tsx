"use client"
import {TooltipProvider} from "@/components/ui/tooltip";
import {
    Microphone,
    MicrophoneOff,
    CameraOff,
    Camera,
    Speaker,
    SpeakerOff,
    Phone, Chat, Monitor, MonitorOff
} from "@/components/shared/Icons";
import DeviceSelector from "@/components/connectPage/DeviceSelector";
import ActionButton from "@/components/connectPage/ActionButton";
import remoteStreamSignal from "@/signals/remoteStream";
import statusSignal from "@/signals/peer/status";
import devicesSignal from "@/signals/devices";
import {isChatDrawerOpenSignal} from "@/signals/drawer";
import {chatChannelSignal, connectionStateSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import hangup from "@/core/hangup";
import {useSignal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";
import haveNewMessageSignal from "@/signals/haveNewMessage";
import cn from "@/lib/utils/cn";
import {Separator} from "@/components/ui/separator";

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
        const sender = peerConnectionSignal.value!.getSenders().find((sender) => {
            /**
             the label check is to make sure that the system audio is not the track that's being muted
             we want to mute the mic track
             */
            return sender.track?.kind === "audio" && sender.track.label !== "System Audio";
        });
        if (sender?.track) {
            sender.track.enabled = !isMicMute.value;
        }
    }

    const muteVideoHandler = () => {
        isVideoMute.value = !isVideoMute.value;
        const sender = peerConnectionSignal.value!.getSenders().find((sender) => {
            return sender.track?.kind === "video";
        });
        if (sender?.track) {
            sender.track.enabled = !isVideoMute.value;
        }
    }

    const muteSoundHandler = () => {
        isSoundMute.value = !isSoundMute.value;
        remoteStreamSignal.value!.getAudioTracks().forEach(audioTrack => {
            audioTrack.enabled = !isSoundMute.value;
        });
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
                <ActionButton
                              icon={<Phone className={"size-7 rotate-[135deg]"}/>}
                              tooltipContent={"قطع تماس"}
                              handler={hangupHandler}/>

                <div className={"flex items-center rounded overflow-hidden"}>
                    <ActionButton
                        className={"rounded-none"}
                        icon={isMicMute.value ? <MicrophoneOff className={"size-7"}/> :
                            <Microphone className={"size-7"}/>}
                        tooltipContent={"قطع / وصل میکروفون"}
                        handler={muteMicHandler}/>

                    <Separator orientation={"vertical"}/>

                    <DeviceSelector devices={devicesSignal.value?.audioInputs}/>
                </div>

                {
                    statusSignal.value?.startsWith("video") &&
                    <div className={"flex items-center rounded overflow-hidden"}>
                        <ActionButton
                            className={"rounded-none"}
                            icon={isVideoMute.value ? <CameraOff className={"size-7"}/> :
                                <Camera className={"size-7"}/>}
                            tooltipContent={"قطع / وصل تصویر"}
                            handler={muteVideoHandler}/>

                        <Separator orientation={"vertical"}/>

                        <DeviceSelector devices={devicesSignal.value?.videoInputs}/>
                    </div>
                }

                {
                    statusSignal.value === "screen:send" &&
                    <ActionButton
                        icon={isVideoMute.value ? <MonitorOff className={"size-7"}/> : <Monitor className={"size-7"}/>}
                        tooltipContent={"قطع / وصل صفحه"}
                        handler={muteVideoHandler}/>
                }

                <div className={"flex items-center rounded overflow-hidden"}>
                    <ActionButton className={"rounded-none"}
                        icon={isSoundMute.value ? <SpeakerOff className={"size-7"}/> : <Speaker className={"size-7"}/>}
                        tooltipContent={"قطع / وصل صدا"}
                        handler={muteSoundHandler}/>

                    <Separator orientation={"vertical"}/>

                    <DeviceSelector devices={devicesSignal.value?.audioOutputs}/>
                </div>

                <ActionButton className={cn({"animate-bounce": haveNewMessageSignal.value})}
                              icon={<Chat className={"size-7"}/>}
                              tooltipContent={"چت"}
                              handler={openChatHandler}/>

            </TooltipProvider>
        </div>
    )
}

export default StreamControls;