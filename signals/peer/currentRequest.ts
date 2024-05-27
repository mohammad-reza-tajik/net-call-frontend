import {signal} from "@preact/signals-react";
import {Request} from "@/types";

const currentRequestSignal = signal<Request | undefined>(undefined);

export default currentRequestSignal;