"use client"
import {TooltipProvider} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {useAppDispatch, useAppSelector} from "@/store";
import {
    Microphone,
    MicrophoneOff,
    CameraOff,
    Camera,
    Stop,
    Speaker,
    SpeakerOff,
    Phone
} from "@/components/shared/Icons";
import DeviceSelector from "@/components/shared/DeviceSelector";
import ActionButton from "@/components/shared/ActionButton";
import {useState} from "react";
import hangup from "@/utils/hangup";

function StreamControls() {

    const peer = useAppSelector(state => state.peer);
    const {status, localStream, remoteStream} = peer;
    const {audioInputs, videoInputs} = useAppSelector(state => state.devices);

    const [muteMic, setMuteMic] = useState(false);
    const [muteVideo, setMuteVideo] = useState(false);
    const [muteSound, setMuteSound] = useState(false);
    const dispatch = useAppDispatch();

    if (!status) {
        return
    }

    function muteMicHandler() {
        setMuteMic((prevState) => !prevState);
        localStream?.getAudioTracks().forEach(track => {
            track.enabled = muteMic;
        })
    }

    function muteVideoHandler() {
        setMuteVideo((prevState) => !prevState);
        localStream?.getVideoTracks().forEach(track => {
            track.enabled = muteVideo;
        })
    }

    function muteSoundHandler() {
        setMuteSound((prevState) => !prevState);
        remoteStream?.getAudioTracks().forEach(track => {
            track.enabled = muteSound;
        })
    }

    return (
        <div className={"flex justify-center items-center gap-5"}>
            <TooltipProvider>
                <ActionButton className={"bg-destructive text-destructive-foreground"} icon={<Phone className={"size-7 rotate-[135deg]"}/>}
                              tooltipContent={"توقف استریم"}
                              handler={() => {
                                  hangup({dispatch, peer})
                              }}/>

                <ActionButton
                    icon={!muteMic ? <Microphone className={"size-7"}/> : <MicrophoneOff className={"size-7"}/>}
                    tooltipContent={muteMic ? "وصل میکروفون" : "قطع میکروفون"}
                    handler={muteMicHandler}/>

                {
                    status?.startsWith("video") || status === "screen:send" &&
                    <ActionButton icon={!muteVideo ? <Camera className={"size-7"}/> : <CameraOff className={"size-7"}/>}
                                  tooltipContent={muteVideo ? "وصل تصویر" : "قطع تصویر"}
                                  handler={muteVideoHandler}/>
                }

                <ActionButton icon={!muteSound ? <Speaker className={"size-7"}/> : <SpeakerOff className={"size-7"}/>}
                              tooltipContent={muteSound ? "وصل صدا" : "قطع صدا"}
                              handler={muteSoundHandler}/>

                <DeviceSelector devices={audioInputs!} text={"میکروفون :"}/>

                {
                    status?.startsWith("video:") && <DeviceSelector devices={videoInputs!} text={"وب کم :"}/>
                }

            </TooltipProvider>
        </div>
    )
}

export default StreamControls;