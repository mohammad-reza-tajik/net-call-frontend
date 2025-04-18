"use client";
import {
  Camera,
  CameraOff,
  Chat,
  Microphone,
  MicrophoneOff,
  Monitor,
  MonitorOff,
  Phone,
  Speaker,
  SpeakerOff,
} from "@/components/shared/Icons";
import DeviceSelector from "@/components/connectPage/DeviceSelector";
import ActionButton from "@/components/connectPage/ActionButton";
import statusSignal from "@/signals/peer/status";
import iODevicesSignal from "@/signals/iODevices";
import { isChatDrawerOpenSignal } from "@/signals/drawer";
import { chatChannelSignal, connectionStateSignal, peerConnectionSignal } from "@/signals/peer/peerConnection";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import haveNewMessageSignal from "@/signals/haveNewMessage";
import cn from "@/lib/utils/cn";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import routerSignal from "@/signals/router";
import hangup from "@/core/hangup";

function StreamControls() {
  useSignals();

  const isMicMuteSignal = useSignal(false);
  const isVideoMuteSignal = useSignal(false);
  const isSoundMuteSignal = useSignal(false);

  if (connectionStateSignal.value !== "connected" || statusSignal.value?.startsWith("game")) {
    return;
  }

  const muteMicHandler = () => {
    isMicMuteSignal.value = !isMicMuteSignal.value;
    const sender = peerConnectionSignal.value!.getSenders().find((sender) => {
      /**
             the label check is to make sure that the system audio is not the track that's being muted
             we want to mute the mic track
             */
      return sender.track?.kind === "audio" && sender.track.label !== "System Audio";
    });
    if (sender?.track) {
      sender.track.enabled = !isMicMuteSignal.value;      
    }
  };

  const muteVideoHandler = () => {
    isVideoMuteSignal.value = !isVideoMuteSignal.value;
    const sender = peerConnectionSignal.value!.getSenders().find((sender) => {
      return sender.track?.kind === "video";
    });
    if (sender?.track) {
      sender.track.enabled = !isVideoMuteSignal.value;
    }
  };

  const muteSoundHandler = () => {
    isSoundMuteSignal.value = !isSoundMuteSignal.value;
    if (remoteVideoRefSignal.value?.current) {
      remoteVideoRefSignal.value.current.muted = isSoundMuteSignal.value;
    }
  };

  const hangupHandler = () => {
    hangup(true);
    routerSignal.value?.push("/");
  };

  const openChatHandler = () => {
    isChatDrawerOpenSignal.value = true;
    haveNewMessageSignal.value = false;
    chatChannelSignal.value?.send("seen");
  };

  return (
    <div className={"flex justify-center items-center gap-3 p-2 border-t border-dashed"}>
      <ActionButton
        icon={<Phone className={"size-7 rotate-[135deg]"} />}
        tooltipContent={"قطع تماس"}
        handler={hangupHandler}
      />

      <div className={"flex items-center rounded overflow-hidden border"}>
        <ActionButton
          className={"rounded-none border-none border-l-2"}
          icon={isMicMuteSignal.value ? <MicrophoneOff className={"size-7"} /> : <Microphone className={"size-7"} />}
          tooltipContent={"قطع / وصل میکروفون"}
          handler={muteMicHandler}
        />

        <DeviceSelector devices={iODevicesSignal.value?.audioInputs} />
      </div>

      {statusSignal.value?.startsWith("video") && (
        <div className={"flex items-center rounded overflow-hidden border"}>
          <ActionButton
            className={"rounded-none border-none border-l-2"}
            icon={isVideoMuteSignal.value ? <CameraOff className={"size-7"} /> : <Camera className={"size-7"} />}
            tooltipContent={"قطع / وصل تصویر"}
            handler={muteVideoHandler}
          />


          <DeviceSelector devices={iODevicesSignal.value?.videoInputs} />
        </div>
      )}

      {statusSignal.value === "screen:send" && (
        <ActionButton
          icon={isVideoMuteSignal.value ? <MonitorOff className={"size-7"} /> : <Monitor className={"size-7"} />}
          tooltipContent={"قطع / وصل صفحه"}
          handler={muteVideoHandler}
        />
      )}

      <div className={"flex items-center rounded overflow-hidden border"}>
        <ActionButton
          className={"rounded-none border-none border-l-2"}
          icon={isSoundMuteSignal.value ? <SpeakerOff className={"size-7"} /> : <Speaker className={"size-7"} />}
          tooltipContent={"قطع / وصل صدا"}
          handler={muteSoundHandler}
        />

        <DeviceSelector devices={iODevicesSignal.value?.audioOutputs} />
      </div>

      <ActionButton
        className={cn({ "animate-bounce": haveNewMessageSignal.value && !isChatDrawerOpenSignal.value })}
        icon={<Chat className={"size-7"} />}
        tooltipContent={"چت"}
        handler={openChatHandler}
      />
    </div>
  );
}

export default StreamControls;
