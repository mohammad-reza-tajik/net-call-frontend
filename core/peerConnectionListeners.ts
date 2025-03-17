import { connectionStateSignal, signalingStateSignal } from "@/signals/peer/peerConnection";
import { toast } from "react-hot-toast";
import remoteStreamSignal from "@/signals/remoteStream";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import dataChannelListeners from "@/core/dataChannelListeners";
import chatChannelListeners from "@/core/chatChannelListeners";
import fileChannelListeners from "@/core/fileChannelListeners";
import gameChannelListeners from "@/core/gameChannelListeners";
import showNotification from "@/lib/utils/showNotification";
import iceCandidatesSignal from "@/signals/peer/iceCandidates";
import hangup from "@/core/hangup";

function peerConnectionListeners(peerConnection: RTCPeerConnection) {
  let iceCandidates: RTCIceCandidate[] = [];

  /*
    using abort controller to control the event listeners and easily remove them later
    */
  const abortController = new AbortController();
  const signal = abortController.signal;

  peerConnection.addEventListener(
    "icecandidate",
    (event) => {
      if (event.candidate !== null) {
        iceCandidates.push(event.candidate);
      } else {
        // when event.candidate is null it means that all candidates have been gathered
        if (iceCandidates.length === 0) {
          toast.error("no candidates found");
          throw new Error("No candidates found");
        }

        iceCandidatesSignal.value = iceCandidates;
        iceCandidates = [];
      }
    },
    { signal },
  );

  peerConnection.addEventListener(
    "signalingstatechange",
    () => {
      signalingStateSignal.value = peerConnection.signalingState;
    },
    { signal },
  );

  peerConnection.addEventListener(
    "connectionstatechange",
    () => {
      connectionStateSignal.value = peerConnection.connectionState;

      if (peerConnection.connectionState === "connected") {
        toast.success("متصل شدید");
        showNotification({
          title: `با موفقیت به ${remotePeerIdSignal.value} متصل شدید `,
        });
      } else if (peerConnection.connectionState === "failed") {
        hangup();
        toast.error("متاسفانه ارتباط برقرار نشد");
      }
    },
    { signal },
  );

  peerConnection.addEventListener(
    "track",
    (event) => {
      remoteStreamSignal.value = event.streams.at(0);
      if (remoteVideoRefSignal.value?.current && remoteStreamSignal.value) {
        remoteVideoRefSignal.value.current.srcObject = remoteStreamSignal.value;
      }
    },
    { signal },
  );

  peerConnection.addEventListener(
    "datachannel",
    ({ channel }) => {
      dataChannelListeners(channel);
      if (channel.label === "chat") {
        chatChannelListeners(channel);
      } else if (channel.label.startsWith("file")) {
        fileChannelListeners(channel);
      } else if (channel.label === "game") {
        gameChannelListeners(channel);
      }
    },
    { signal },
  );

  return abortController;
}

export default peerConnectionListeners;
