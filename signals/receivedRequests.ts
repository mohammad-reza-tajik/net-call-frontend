import {signal} from "@preact/signals-react";
import {Request} from "@/types";

const receivedRequestsSignal = signal<Request[]>([]);

export default receivedRequestsSignal;