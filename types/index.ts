import type {Socket} from "socket.io-client";
import {MutableRefObject} from "react";

export interface Request {
    offer: RTCSessionDescriptionInit;
    peerId: string;
    socketId: string;
    iceCandidates: RTCIceCandidate[];
}

export interface Response {
    answer: RTCSessionDescriptionInit;
    peerId: string;
    socketId: string;
    iceCandidates: RTCIceCandidate[];
}

export interface Peer {
    status?: "shareScreen" | "audioCall" | "video" | "receiveScreen" | "loading";
    peerId?: string;
    iceCandidates?:RTCIceCandidate[];
    peerConnection?: RTCPeerConnection;
    requests : Request[];
    // response : Request[];
    socket?: Socket;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    stream?: MediaStream;
    videoRef? :  MutableRefObject<HTMLVideoElement | null>;
}

