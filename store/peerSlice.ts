import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {type Socket} from "socket.io-client";
// @ts-ignore
import {WritableDraft} from "immer";
import {MutableRefObject} from "react";
import shareScreenSlice from "@/store/shareScreenSlice";

export interface Peer {
    status: "shareScreen" | "audioCall" | "video",
    peerId: string,
    iceCandidates:RTCIceCandidate[],
    peerConnection: RTCPeerConnection,
    socket: Socket,
    offer: RTCSessionDescriptionInit,
    stream: MediaStream,
    videoRef :  MutableRefObject<HTMLVideoElement | null>
}

const initialState: Partial<Peer> = {
    status: undefined,
    peerId: undefined,
    iceCandidates:[],
    socket: undefined,
    peerConnection: undefined,
    offer: undefined,
    stream: undefined,
    videoRef: undefined,
}

const peerSlice = createSlice({
    name: "peer",
    initialState,
    reducers: {
        setPeer: (state, action: PayloadAction<Partial<Peer>>) => {
            Object.keys(action.payload).forEach(key => {
                // @ts-ignore
                state[key] = action.payload[key];
            })
        }
        /*setStream(state, action: PayloadAction<MediaStream>) {
            state.stream = action.payload;
        },
        setSocket(state, action: PayloadAction<Socket>) {
            state.socket = action.payload as WritableDraft<Socket>;
        },
        setPeerConnection(state, action: PayloadAction<RTCPeerConnection>) {
            state.peerConnection = action.payload;
        },
        setPeerId()*/

    }
});

export const peerActions = peerSlice.actions;

export default peerSlice