import {Request, type Status} from "@/types";
import {answerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import statusSignal from "@/signals/peer/status";
import receivedRequestsSignal from "@/signals/receivedRequests";
import localVideoRefSignal from "@/signals/localVideoRef";

async function createAnswer({request}: {request: Request}) {

    const answerStatus = request.status.split(":").at(0)!.concat(":receive") as Status;

    if (!peerConnectionSignal.value || !localStreamSignal.value) {
        return;
    }

    if (request.status === "audio:send" || request.status === "screen:send") {
        localStreamSignal.value.getAudioTracks().forEach(track => {
            peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
        })
    } else if (request.status === "video:send") {
        localStreamSignal.value.getTracks().forEach(track => {
            peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
        })
    }

    await peerConnectionSignal.value.setRemoteDescription(request.offer);
    const answer = await peerConnectionSignal.value.createAnswer();
    request.iceCandidates.forEach(item => {
        peerConnectionSignal.value!.addIceCandidate(item);
    })
    await peerConnectionSignal.value.setLocalDescription(answer);

    statusSignal.value = answerStatus;
    answerSignal.value=answer;
    receivedRequestsSignal.value = receivedRequestsSignal.value.filter(item => item.localPeerId !== request.localPeerId);

    if (localVideoRefSignal.value?.current && request.status === "video:send") {
        console.log("video is here")
        localVideoRefSignal.value.current.srcObject = localStreamSignal.value;
    }

    return answer;

}

export default createAnswer;