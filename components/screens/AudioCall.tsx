"use client";
import { Phone } from "@/components/shared/Icons";
import remoteStreamSignal from "@/signals/remoteStream";
import useVoiceDetection from "@/hooks/useVoiceDetection";
import { Ripple } from "@/components/magicui/ripple";
import { useSignals } from "@preact/signals-react/runtime";


function AudioCall() {
  
  useSignals();

  const remoteSpeaking = useVoiceDetection(remoteStreamSignal.value!);

  return (
    <div className={"flex flex-col size-full"}>
      <div className={"flex justify-center items-center relative flex-1"}>
        {remoteSpeaking && <Ripple numCircles={3} />}
        <Phone className={"size-14 md:size-20"} />
      </div>
    </div>
  );
}

export default AudioCall;
