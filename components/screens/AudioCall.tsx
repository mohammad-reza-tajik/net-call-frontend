"use client";
import { Phone } from "@/components/shared/Icons";
import remoteStreamSignal from "@/signals/remoteStream";
import AudioVisualizer from "@/components/connectPage/AudioVisualizer";
import localStreamSignal from "@/signals/localStream";
import friendsSignal from "@/signals/peer/friends";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";

const displaySender = () => {
  const friend = friendsSignal.value.find((peer) => peer.localPeerId === remotePeerIdSignal.value);
  return friend ? friend.name : remotePeerIdSignal.value;
};

function AudioCall() {
  return (
    <div className={"flex flex-col items-center size-full relative"}>
      <p className={"flex justify-center items-center mt-10 bg-primary text-primary-foreground px-5 py-3 rounded"}>
        {displaySender()}
      </p>
      <AudioVisualizer stream={remoteStreamSignal.value!} fftSize={128} width={400} height={400} color={"#DC2626"} />
      <AudioVisualizer
        stream={localStreamSignal.value!}
        className={"rotate-180"}
        color={"#3B82F6"}
        fftSize={128}
        width={400}
        height={400}
      />
      <Phone className={"size-14 md:size-20 absolute top-1/2 left-1/2 z-10 -translate-1/2"} />
    </div>
  );
}

export default AudioCall;
