import {signal} from "@preact/signals-react";
import type {Socket} from "socket.io-client";

const socketSignal = signal<Socket | undefined>(undefined);

export default socketSignal;