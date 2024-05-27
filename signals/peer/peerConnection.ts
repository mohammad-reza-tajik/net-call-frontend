import {signal} from "@preact/signals-react";
import createConnection from "@/utils/createConnection";

const peerConnectionSignal = signal(createConnection());

export default peerConnectionSignal;