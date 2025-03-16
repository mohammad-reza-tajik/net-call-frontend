import localStreamSignal from "@/signals/localStream";
import addToConnection from "@/core/addToConnection";
import toast from "react-hot-toast";

async function audioCall() {
    try {

        if (!localStreamSignal.value) {
            throw new Error("no local stream");
        }

        const [audioTrack] = localStreamSignal.value.getAudioTracks();

        await addToConnection("audio:send",audioTrack);

    } catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
            console.error(err);
        }
    }

}

export default audioCall;