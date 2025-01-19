import {
    diceSignal,
    gameChannelSignal,
    isGameOverSignal,
    isYourTurnSignal,
    myScoreSignal,
    opponentScoreSignal,
    temporaryScoreSignal
} from "@/signals/games/pigGame";
import {batch} from "@preact/signals-react";

function gameChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("message", ({data}) => {
        console.log(data);
        const {type, dice, temporaryScore, score} = JSON.parse(data);

        if (type === "changeTurn") {
            isYourTurnSignal.value = true;
        }

        if (type === "rollDice") {
            batch(() => {
                diceSignal.value = dice;
                temporaryScoreSignal.value = temporaryScore;
            })
        }

        if (type === "addScore") {
            batch(() => {
                isYourTurnSignal.value = true;
                opponentScoreSignal.value = score;
                temporaryScoreSignal.value = 0;
            })
        }

        if (type === "restartGame") {
            batch(() => {
                isYourTurnSignal.value = false;
                myScoreSignal.value = 0;
                opponentScoreSignal.value = 0;
                temporaryScoreSignal.value = 0;
                diceSignal.value = 1;
                isGameOverSignal.value = false;
            })
        }

    })

    gameChannelSignal.value = dataChannel;

}

export default gameChannelListeners;