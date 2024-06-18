import statusSignal from "@/signals/peer/status";
import localStreamSignal from "@/signals/localStream";
import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localVideoRefSignal from "@/signals/localVideoRef";

async function videoCall() {
    try {

        statusSignal.value = "video:send";

        if (!localStreamSignal.value || !peerConnectionSignal.value) {
            return
        }


        localStreamSignal.value.getTracks().forEach(track => {
            peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
        });

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);
        offerSignal.value = offer;

        if (localVideoRefSignal.value?.current) {
            /*
                we are creating a new stream in a video call because
                we only need the video track to show in local stream
             */
            const localStream = new MediaStream();
            localStream.addTrack(localStreamSignal.value.getVideoTracks().at(0)!);
            localVideoRefSignal.value.current.srcObject = localStream;
        }

    } catch (err) {
        console.log(err);
    }

}

export default videoCall;