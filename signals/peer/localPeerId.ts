import {signal} from "@preact/signals-react";
import createId from "@/utils/createId";

const localPeerIdSignal = signal(createId());

export default localPeerIdSignal;