import {signal} from "@preact/signals-react";
import {MutableRefObject} from "react";

const remoteVideoRefSignal = signal<MutableRefObject<HTMLVideoElement | null> | null>(null);

export default remoteVideoRefSignal;