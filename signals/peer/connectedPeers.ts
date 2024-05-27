import {signal} from "@preact/signals-react";
import {ConnectedPeer} from "@/types";

const connectedPeersSignal = signal<ConnectedPeer[]>([]);

export default connectedPeersSignal;