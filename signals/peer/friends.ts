import {signal} from "@preact/signals-react";
import type {IConnectedPeer} from "@/types";

const friendsSignal = signal<IConnectedPeer[]>([]);

export default friendsSignal;