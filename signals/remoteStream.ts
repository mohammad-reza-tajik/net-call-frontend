import {signal} from "@preact/signals-react";

const remoteStreamSignal = signal<MediaStream | undefined>(undefined);

export default remoteStreamSignal;