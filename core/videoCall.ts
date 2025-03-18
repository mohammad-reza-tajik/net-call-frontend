import localStreamSignal from "@/signals/localStream";
import localVideoRefSignal from "@/signals/localVideoRef";
import addToConnection from "@/core/addToConnection";
import toast from "react-hot-toast";

async function videoCall() {
    try {

        if (!localStreamSignal.value) {
            throw new Error("no local stream");
        }


        const tracks = localStreamSignal.value.getTracks();

        if (tracks.length < 2) {
            throw new Error("Video call requires both audio and video tracks");
          }

        await addToConnection("video:send",...tracks);

        if (localVideoRefSignal.value?.current) {
            /*
                we are creating a new stream in a video call because
                we only need the video track to show in local stream
             */
            const localStream = new MediaStream();
            const [videoTrack] = localStreamSignal.value.getVideoTracks();
            localStream.addTrack(videoTrack);
            localVideoRefSignal.value.current.srcObject = localStream;
        }

    } catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
            console.error(err);
        }
    }

}

export default videoCall;