import {signal} from "@preact/signals-react";
import type {IConnectedPeer} from "@/types";

const visibilitySignal = signal<IConnectedPeer["visibility"]>("hidden");

export default visibilitySignal;