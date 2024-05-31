import {signal} from "@preact/signals-react";
import type {IFileMessage, ITextMessage} from "@/types";

const messagesSignal = signal<(ITextMessage | IFileMessage)[]>([]);

export default messagesSignal;