export type TStatus = `${"screen" | "video" | "audio" | "game"}:${"send"|"receive"}`;

export type TDeviceType = "desktop" | "mobile";

export type TVisibility = "visible" | "hidden";

export interface IConnectedPeer {
    socketId : string;
    localPeerId : string;
    deviceType: TDeviceType;
    visibility: TVisibility;
}

export interface IFriend {
    name : string;
    localPeerId : string;
    isOnline : boolean;
}

export interface IConnectionPayload {
    localPeerId: string;
    remotePeerId: string;
    socketId: string;
    status: TStatus;
    iceCandidates: RTCIceCandidate[];
}

export interface IRequest extends IConnectionPayload {
    offer: RTCSessionDescriptionInit;
    
}

export interface IResponse extends IConnectionPayload {
    answer: RTCSessionDescriptionInit;
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

export interface ManagedPeerConnection extends RTCPeerConnection {
    abortController?: AbortController;
  }
  