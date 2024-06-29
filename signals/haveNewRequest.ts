import {signal} from "@preact/signals-react";

const haveNewRequestSignal = signal<boolean>(false);

export default haveNewRequestSignal;