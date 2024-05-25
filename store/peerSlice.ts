import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ConnectedPeer, Peer, Request} from "@/types";
// @ts-ignore
import {WritableDraft} from "immer";

const initialState: Peer = {
    status: undefined,
    localPeerId: undefined,
    remotePeerId :undefined,
    answer : undefined,
    iceCandidates:[],
    connectedPeers:[],
    socket: undefined,
    peerConnection: undefined,
    offer: undefined,
    receivedRequests : [],
    currentRequest : undefined,
    currentResponse: undefined,
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
        setConnectedPeers(state, action : PayloadAction<ConnectedPeer[]>) {
            state.connectedPeers = action.payload;
        },
        setStatus(state, action: PayloadAction<Peer["status"]>)  {
            state.status = action.payload;
        },
        setCurrentRequest (state, action: PayloadAction<Peer["currentRequest"]>)  {
            state.currentRequest = action.payload;
        },
        setCurrentResponse (state, action: PayloadAction<Peer["currentResponse"]>)  {
            state.currentResponse = action.payload;
        },
        setRemotePeerId (state, action: PayloadAction<Peer["remotePeerId"]>)  {
          state.remotePeerId = action.payload;
        },
        setLocalPeerId (state, action: PayloadAction<Peer["localPeerId"]>)  {
            state.localPeerId = action.payload;
        },
        addIceCandidate (state, action: PayloadAction<RTCIceCandidate>)  {
            state.iceCandidates?.push(action.payload);
        },
        setPeerConnection (state, action: PayloadAction<Peer["peerConnection"]>)  {
            state.peerConnection = action.payload;
        },
        setSocket (state, action: PayloadAction<Peer["socket"]>)  {
            state.socket = action.payload as WritableDraft<Peer["socket"]>;
        },
        setOffer (state, action: PayloadAction<Peer["offer"]>)  {
            state.offer = action.payload;
        },
        setAnswer (state, action: PayloadAction<Peer["answer"]>)  {
            state.answer = action.payload;
        },
        setLocalStream (state, action: PayloadAction<Peer["localStream"]>)  {
            state.localStream = action.payload;
        },
        setRemoteStream (state, action: PayloadAction<Peer["remoteStream"]>)  {
            state.remoteStream = action.payload;
        },
        setLocalVideoRef (state, action: PayloadAction<Peer["localVideoRef"]>)  {
            state.localVideoRef = action.payload as WritableDraft<Peer["localVideoRef"]>;
        },
        setRemoteVideoRef (state, action: PayloadAction<Peer["remoteVideoRef"]>)  {
            state.remoteVideoRef = action.payload as WritableDraft<Peer["remoteVideoRef"]>;
        },
        addRequest(state,action :PayloadAction<Request> ) {
            state.receivedRequests.push(action.payload);
        },
        removeRequest(state , action : PayloadAction<Request>) {
            state.receivedRequests  = state.receivedRequests.filter(item => item.peerId !== action.payload.peerId);
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