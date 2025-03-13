import { signal } from "@preact/signals-react";

const iceCandidatesSignal = signal<RTCIceCandidate[]>([]);

export default iceCandidatesSignal;
