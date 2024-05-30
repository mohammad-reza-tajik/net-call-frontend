import type {Socket} from "socket.io-client";
import {MutableRefObject} from "react";

export type Status = "screen:send" | "audio:send" | "audio:receive" | "video:send" | "video:receive" | "screen:receive";

export interface ConnectedPeer {
    socketId : string;
    localPeerId : string;
    deviceType: "desktop" | "mobile";
}

export interface Request {
    offer: RTCSessionDescriptionInit;
    localPeerId: string;
    remotePeerId: string;
    socketId: string;
    status: Status;
    iceCandidates: RTCIceCandidate[];
}

export interface Response {
    answer: RTCSessionDescriptionInit;
    localPeerId: string;
    remotePeerId: string;
    socketId: string;
    status: Status;
    iceCandidates: RTCIceCandidate[];
}

export interface Peer {
    status?: Status;
    connectedPeers : ConnectedPeer[];
    connectionMode? : "group" | "pair";
    localPeerId?: string;
    remotePeerId?: string;
    iceCandidates?: RTCIceCandidate[];
    peerConnection?: RTCPeerConnection;
    receivedRequests: Request[];
    currentRequest? : Request;
    currentResponse?: Response;
    socket?: Socket;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    localStream?: MediaStream;
    remoteStream?: MediaStream;
    signallingState? : RTCPeerConnection["signalingState"];
    connectionState? : RTCPeerConnection["connectionState"];
    localVideoRef?: MutableRefObject<HTMLVideoElement | null>;
    remoteVideoRef?: MutableRefObject<HTMLVideoElement | null>;

}

export interface Devices {
    audioInputs? : MediaDeviceInfo[];
    audioOutputs? : MediaDeviceInfo[];
    videoInputs? : MediaDeviceInfo[];
    currentVideoInput? : MediaDeviceInfo;
    currentAudioInput? : MediaDeviceInfo;
    currentAudioOutput? : MediaDeviceInfo;
}

export interface TextMessage {
    type: "text";
    text : string;
    localPeerId: string;
}

export interface FileMessage {
    type: "file";
    localPeerId: string;
    file : ArrayBuffer;
}

