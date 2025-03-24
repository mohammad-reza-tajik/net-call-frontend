import localStreamSignal from "@/signals/localStream";
import addToConnection from "@/core/addToConnection";
import toast from "react-hot-toast";

async function shareScreen() {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });

    if (!localStreamSignal.value) {
      throw new Error("no local stream");
    }

    const [audioTrack] = localStreamSignal.value.getAudioTracks();

    if (audioTrack) {
      screenStream.addTrack(audioTrack);
    }

    await addToConnection("screen:send", ...screenStream.getTracks());
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
      console.error(err);
    }
  }
}

export default shareScreen;
