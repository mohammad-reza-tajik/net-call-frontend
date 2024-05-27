import {signal} from "@preact/signals-react";
import {Status} from "@/types";

const statusSignal = signal<Status | undefined>(undefined);

export default statusSignal;