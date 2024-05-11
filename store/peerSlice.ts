import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Peer} from "@/types";
// @ts-ignore
import {WritableDraft} from "immer";

const initialState: Peer = {
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
        setStatus: (state, action: PayloadAction<Peer["status"]>) => {
            state.status = action.payload;
        },
        setPeerId: (state, action: PayloadAction<Peer["peerId"]>) => {
            state.peerId = action.payload;
        },
        addIceCandidate: (state, action: PayloadAction<RTCIceCandidate>) => {
            state.iceCandidates?.push(action.payload);
        },
        setPeerConnection: (state, action: PayloadAction<Peer["peerConnection"]>) => {
            state.peerConnection = action.payload;
        },
        setSocket: (state, action: PayloadAction<Peer["socket"]>) => {
            state.socket = action.payload as WritableDraft<Peer["socket"]>;
        },
        setOffer: (state, action: PayloadAction<Peer["offer"]>) => {
            state.offer = action.payload;
        },
        setStream: (state, action: PayloadAction<Peer["stream"]>) => {
            state.stream = action.payload;
        },
        setVideoRef: (state, action: PayloadAction<Peer["videoRef"]>) => {
            state.videoRef = action.payload as WritableDraft<Peer["videoRef"]>;
        },
}}
);

export const peerActions = peerSlice.actions;

export default peerSlice