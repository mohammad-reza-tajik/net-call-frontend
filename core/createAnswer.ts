import type { IRequest, TStatus } from "@/types";
import { answerSignal, peerConnectionSignal } from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import statusSignal from "@/signals/peer/status";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import localVideoRefSignal from "@/signals/localVideoRef";
import { batch } from "@preact/signals-react";
import toast from "react-hot-toast";
import createConnection from "@/core/createConnection";

async function createAnswer({ request }: { request: IRequest }) {
    try {
        const answerStatus = request.status.split(":").at(0)!.concat(":receive") as TStatus;
        
        peerConnectionSignal.value = createConnection();

        localStreamSignal.value = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });

        if (!peerConnectionSignal.value || !localStreamSignal.value) {
            throw new Error("no peer connection or local stream");
        }

        if (request.status === "audio:send" || request.status === "screen:send") {
            const [audioTrack] = localStreamSignal.value.getAudioTracks();
            peerConnectionSignal.value.addTrack(audioTrack, localStreamSignal.value);
        } else if (request.status === "video:send") {
            localStreamSignal.value.getTracks().forEach((track) => {
                peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
            });
        }

        await peerConnectionSignal.value.setRemoteDescription(request.offer);
        const answer = await peerConnectionSignal.value.createAnswer();
        await peerConnectionSignal.value.setLocalDescription(answer);

        request.iceCandidates.forEach((item) => {
            peerConnectionSignal.value!.addIceCandidate(item);
        });

        batch(() => {
            statusSignal.value = answerStatus;
            answerSignal.value = answer;
            receivedRequestsSignal.value = receivedRequestsSignal.value.filter(
                (item) => item.localPeerId !== request.localPeerId,
            );
        });

        if (localVideoRefSignal.value?.current && request.status === "video:send") {
            /*
                we are creating a new stream in a video call ,
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

export default createAnswer;
