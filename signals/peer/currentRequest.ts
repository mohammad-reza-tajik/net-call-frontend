import {signal} from "@preact/signals-react";
import type {IRequest} from "@/types";

const currentRequestSignal = signal<IRequest | undefined>(undefined);

export default currentRequestSignal;