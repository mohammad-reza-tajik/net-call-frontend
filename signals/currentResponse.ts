import {signal} from "@preact/signals-react";
import {Response} from "@/types";

const currentResponseSignal = signal<Response | undefined>(undefined);

export default currentResponseSignal;