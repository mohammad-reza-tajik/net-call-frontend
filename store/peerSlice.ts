import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Peer, Request} from "@/types";
// @ts-ignore
import {WritableDraft} from "immer";

const initialState: Peer = {
    senderSocketId : undefined,
    status: undefined,
    peerId: undefined,
    answer : undefined,
    iceCandidates:[],
    socket: undefined,
    peerConnection: undefined,
    offer: undefined,
    requests : [],
    localStream: undefined,
    remoteStream: undefined,
    localVideoRef: undefined,
    remoteVideoRef: undefined,
    signallingState: undefined,
    connectionState: undefined,
}

const peerSlice = createSlice({
    name: "peer",
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<Peer["status"]>) => {
            state.status = action.payload;
        },
        setSenderSocketId: (state, action: PayloadAction<Peer["senderSocketId"]>) => {
            state.senderSocketId = action.payload;
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
        setLocalStream: (state, action: PayloadAction<Peer["localStream"]>) => {
            state.localStream = action.payload;
        },
        setRemoteStream: (state, action: PayloadAction<Peer["remoteStream"]>) => {
            state.remoteStream = action.payload;
        },
        setLocalVideoRef: (state, action: PayloadAction<Peer["localVideoRef"]>) => {
            state.localVideoRef = action.payload as WritableDraft<Peer["localVideoRef"]>;
        },
        setRemoteVideoRef: (state, action: PayloadAction<Peer["remoteVideoRef"]>) => {
            state.remoteVideoRef = action.payload as WritableDraft<Peer["remoteVideoRef"]>;
        },
        addRequest(state,action :PayloadAction<Request> ) {
            state.requests.push(action.payload);
        },
        removeRequest(state , action : PayloadAction<Request>) {
            state.requests  = state.requests.filter(item => item.peerId !== action.payload.peerId);
        },
        setConnectionState(state, action : PayloadAction<Peer["connectionState"]>) {
            state.connectionState = action.payload;
        },
        setSignallingState(state, action : PayloadAction<Peer["signallingState"]>) {
            state.signallingState = action.payload;
        }
}}
);

export const peerActions = peerSlice.actions;

export default peerSlice