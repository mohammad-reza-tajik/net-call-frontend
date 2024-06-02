
export type TStatus = `${"screen" | "video" | "audio"}:${"send"|"receive"}`;

export interface IConnectedPeer {
    socketId : string;
    localPeerId : string;
    deviceType: "desktop" | "mobile";
}

export interface IRequest {
    offer: RTCSessionDescriptionInit;
    localPeerId: string;
    remotePeerId: string;
    socketId: string;
    status: TStatus;
    iceCandidates: RTCIceCandidate[];
}

export interface IResponse {
    answer: RTCSessionDescriptionInit;
    localPeerId: string;
    remotePeerId: string;
    socketId: string;
    status: TStatus;
    iceCandidates: RTCIceCandidate[];
}

export interface ITextMessage {
    text : string;
    type: "text";
    localPeerId: string;
}

export interface IFileData {
    name : string;
    mimeType : string;
    size : number;
}

export interface IFileMessage {
    file: File | IFileData;
    type: "file";
    localPeerId: string;
    transferredAmount : number;
}

