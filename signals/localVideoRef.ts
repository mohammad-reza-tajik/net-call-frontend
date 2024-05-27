import {signal} from "@preact/signals-react";
import {MutableRefObject} from "react";

const localVideoRefSignal = signal<MutableRefObject<HTMLVideoElement | null> | null>(null);

export default localVideoRefSignal