import {signal} from "@preact/signals-react";

const haveNewMessageSignal = signal<boolean>(false);

export default haveNewMessageSignal;