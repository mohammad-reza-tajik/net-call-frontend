import {signal} from "@preact/signals-react";
import {Request} from "@/types";

const receivedRequests = signal<Request[]>([]);

export default receivedRequests;