
export type TStatus = `${"screen" | "video" | "audio" | "game"}:${"send"|"receive"}`;

export type TDeviceType = "desktop" | "mobile";

export interface IConnectedPeer {
    socketId : string;
    localPeerId : string;
    deviceType: TDeviceType;
    visibility: "visible" | "hidden";
}

export interface IFriend extends IConnectedPeer {
    alias : string;
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

export interface IMessage {
    localPeerId: string;
    seen? : boolean;
    timestamp : Date;
}

export interface ITextMessage extends IMessage {
    text : string;
    type: "text";
}

export interface IFileData {
    name : string;
    mimeType : string;
    size : number;
    timestamp : Date;
}

export interface IFileMessage extends IMessage{
    file: File | IFileData;
    type: "file";
    transferredAmount : number;
}

