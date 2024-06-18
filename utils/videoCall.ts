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

        /*
            we get the video stream because if we were in a share screen call before , since we overrode the
            localStream , our video track is now the screen track so get the video track again to use it for video call
         */

        const videoCallStream = await navigator.mediaDevices.getUserMedia({video: true,audio: true});

        videoCallStream.getTracks().forEach(track => {
            peerConnectionSignal.value!.addTrack(track, videoCallStream);
        });

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);
        offerSignal.value = offer;
        localStreamSignal.value = videoCallStream;

        if (localVideoRefSignal.value?.current) {
            /*
                we are creating a new stream in a video call ,
                we only need the video track to show in local stream
             */
            const localStream = new MediaStream();
            localStream.addTrack(localStreamSignal.value?.getVideoTracks().at(0)!);
            localVideoRefSignal.value.current.srcObject = localStream;
        }

    } catch (err) {
        console.log(err);
    }

}

export default videoCall;