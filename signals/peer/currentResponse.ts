import {signal} from "@preact/signals-react";
import type {IResponse} from "@/types";

const currentResponseSignal = signal<IResponse | undefined>(undefined);

export default currentResponseSignal;