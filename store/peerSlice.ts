import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Peer, Request} from "@/types";
// @ts-ignore
import {WritableDraft} from "immer";

const initialState: Peer = {
    status: undefined,
    peerId: undefined,
    answer : undefined,
    iceCandidates:[],
    socket: undefined,
    peerConnection: undefined,
    offer: undefined,
    requests : [],
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
        setAnswer: (state, action: PayloadAction<Peer["answer"]>) => {
            state.answer = action.payload;
        },
        setStream: (state, action: PayloadAction<Peer["stream"]>) => {
            state.stream = action.payload;
        },
        setVideoRef: (state, action: PayloadAction<Peer["videoRef"]>) => {
            state.videoRef = action.payload as WritableDraft<Peer["videoRef"]>;
        },
        addRequest(state,action :PayloadAction<Request> ) {
            state.requests.push(action.payload);
        },
        removeRequest(state , action : PayloadAction<Request>) {
            state.requests  = state.requests.filter(item => item.peerId !== action.payload.peerId);
        }
}}
);

export const peerActions = peerSlice.actions;

export default peerSlice