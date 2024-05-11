import type {Socket} from "socket.io-client";
import {MutableRefObject} from "react";

export interface Peer {
    status?: "shareScreen" | "audioCall" | "video";
    peerId?: string;
    iceCandidates?:RTCIceCandidate[];
    peerConnection?: RTCPeerConnection;
    socket?: Socket;
    offer?: RTCSessionDescriptionInit;
    stream?: MediaStream;
    videoRef? :  MutableRefObject<HTMLVideoElement | null>;
}