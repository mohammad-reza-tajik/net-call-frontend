import {signal} from "@preact/signals-react";

const localStreamSignal = signal<MediaStream | undefined>(undefined);

export default localStreamSignal;