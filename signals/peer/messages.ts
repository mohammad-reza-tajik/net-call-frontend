import {signal} from "@preact/signals-react";
import {FileMessage, TextMessage} from "@/types";

const messagesSignal = signal<(TextMessage | FileMessage)[]>([]);

export default messagesSignal;