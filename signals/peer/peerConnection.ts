import type { ManagedPeerConnection } from "@/types";
import {signal} from "@preact/signals-react";

const peerConnectionSignal = signal<ManagedPeerConnection | undefined>(undefined);
const signalingStateSignal = signal<RTCSignalingState | undefined>(undefined);
const connectionStateSignal = signal<RTCPeerConnectionState | undefined>(undefined);
const offerSignal = signal<RTCSessionDescriptionInit | undefined>(undefined);
const answerSignal = signal<RTCSessionDescriptionInit | undefined>(undefined);
const chatChannelSignal = signal<RTCDataChannel | undefined>(undefined);


export {peerConnectionSignal ,signalingStateSignal,connectionStateSignal, offerSignal , answerSignal , chatChannelSignal};