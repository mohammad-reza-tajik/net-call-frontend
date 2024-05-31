import {signal} from "@preact/signals-react";
import type {IConnectedPeer} from "@/types";

const connectedPeersSignal = signal<IConnectedPeer[]>([]);

export default connectedPeersSignal;