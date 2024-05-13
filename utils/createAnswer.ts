import {Request} from "@/types";

async function createAnswer({request , peerConnection}: { peerConnection : RTCPeerConnection, request: Request }) {
    try {
        let localStream : MediaStream | undefined ;

        if (request.status === "audio:send" || request.status === "screen:send") {
            localStream =  await navigator.mediaDevices.getUserMedia({ audio: true });
        } else if (request.status === "video:send") {
            localStream = (await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
        }

        localStream?.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        })

        await peerConnection?.setRemoteDescription(request.offer);
        const answer = await peerConnection?.createAnswer();
        request.iceCandidates.forEach(item => {
            peerConnection?.addIceCandidate(item);
        })
        await peerConnection?.setLocalDescription(answer);

        return {answer , localStream};

    } catch (err) {
        console.log(err);
    }

}

export default createAnswer;