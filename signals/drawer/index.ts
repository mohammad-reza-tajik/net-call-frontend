import {signal} from "@preact/signals-react";

const isRequestsDrawerOpenSignal = signal<boolean>(false);
const isChatDrawerOpenSignal = signal<boolean>(false);

export {isChatDrawerOpenSignal , isRequestsDrawerOpenSignal}
