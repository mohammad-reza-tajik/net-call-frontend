import {signal} from "@preact/signals-react";
import type {TStatus} from "@/types";

const statusSignal = signal<TStatus | undefined>(undefined);

export default statusSignal;