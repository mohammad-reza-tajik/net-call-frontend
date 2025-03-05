import {signal} from "@preact/signals-react";

const myScoreSignal = signal(0);
const opponentScoreSignal = signal(0);
const temporaryScoreSignal = signal(0);
const gameChannelSignal = signal<RTCDataChannel | undefined>(undefined);
const isGameOverSignal = signal(false);
const diceSignal = signal(5);
const isYourTurnSignal = signal(false);


export {myScoreSignal, temporaryScoreSignal , opponentScoreSignal , gameChannelSignal , isGameOverSignal , isYourTurnSignal ,diceSignal};