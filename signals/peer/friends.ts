import {signal} from "@preact/signals-react";
import type {IFriend} from "@/types";

const friendsSignal = signal<IFriend[]>([]);

export default friendsSignal;