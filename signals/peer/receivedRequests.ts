import {signal} from "@preact/signals-react";
import type {IRequest} from "@/types";

const receivedRequestsSignal = signal<IRequest[]>([]);

export default receivedRequestsSignal;