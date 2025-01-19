"use client"

import {Button} from "@/components/ui/button";
import {Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Plus} from "@/components/shared/Icons";
import randomInt from "@/lib/utils/randomInt";
import {useSignalEffect, useSignals} from "@preact/signals-react/runtime";
import {toast} from "react-hot-toast";
import {
    diceSignal,
    gameChannelSignal,
    isGameOverSignal,
    isYourTurnSignal,
    myScoreSignal,
    opponentScoreSignal,
    temporaryScoreSignal
} from "@/signals/games/pigGame";

function PigGame() {

    useSignals();

    useSignalEffect(() => {

        if (isGameOverSignal.value) return;

        if (myScoreSignal.value >= 100) {
            isGameOverSignal.value = true;
            toast.success("شما برنده شدید");
        }

        if (opponentScoreSignal.value >= 100) {
            isGameOverSignal.value = true;
            toast.success("شما باختید");
        }
    });

    function rollDiceHandler() {
        const dice = randomInt(1, 6);
        diceSignal.value = dice;
        if (dice !== 1) {
            temporaryScoreSignal.value += dice;
        } else {
            temporaryScoreSignal.value = 0;
            isYourTurnSignal.value = false;
            gameChannelSignal.value?.send(JSON.stringify({type: "changeTurn"}));
        }
        gameChannelSignal.value?.send(JSON.stringify({
            type: "rollDice",
            dice,
            temporaryScore: temporaryScoreSignal.value
        }));

    }

    function addScoreHandler() {
        if (temporaryScoreSignal.value === 0) return;
        isYourTurnSignal.value = false;
        myScoreSignal.value += temporaryScoreSignal.value;
        gameChannelSignal.value?.send(JSON.stringify({type: "addScore", score: myScoreSignal.value}));
        temporaryScoreSignal.value = 0;
    }


    function renderDice() {
        if (diceSignal.value === 1) return <Dice1 className={"size-36"}/>
        else if (diceSignal.value === 2) return <Dice2 className={"size-36"}/>
        else if (diceSignal.value === 3) return <Dice3 className={"size-36"}/>
        else if (diceSignal.value === 4) return <Dice4 className={"size-36"}/>
        else if (diceSignal.value === 5) return <Dice5 className={"size-36"}/>
        else return <Dice6 className={"size-36"}/>
    }

    function restartGameHandler() {
        isYourTurnSignal.value = true;
        diceSignal.value = 1;
        opponentScoreSignal.value = 0;
        temporaryScoreSignal.value = 0;
        myScoreSignal.value = 0;
        gameChannelSignal.value?.send(JSON.stringify({type: "restartGame"}));
        isGameOverSignal.value = false;
    }

    return (
        <section className={"flex flex-col justify-between items-center gap-5 flex-1 w-full relative"}>

            {
                isGameOverSignal.value && (
                    <div
                        className={"bg-background opacity-90 z-50 absolute inset-0 flex justify-center items-center flex-col gap-5"}>
                        <p>
                            بازی تمام شد
                        </p>
                        <Button onClick={restartGameHandler}>شروع مجدد</Button>
                    </div>
                )
            }

            <div className={"bg-destructive flex justify-center items-center p-5 rounded w-full"}>
                {opponentScoreSignal.value}
            </div>


            {renderDice()}

            <div className={"border rounded size-12 flex justify-center items-center text-xl"}>
                {temporaryScoreSignal.value}
            </div>

            <div className={"flex items-center justify-center gap-5"}>
                <Button className={"gap-2"} onClick={rollDiceHandler} disabled={!isYourTurnSignal.value}>
                    <Dice5 className={"size-5"}/>
                    انداختن تاس
                </Button>
                <Button className={"gap-2"} onClick={addScoreHandler} disabled={!isYourTurnSignal.value}>
                    <Plus className={"size-5"}/>
                    دریافت
                </Button>
            </div>

            <div className={"bg-primary flex justify-center items-center p-5 rounded w-full"}>
                {myScoreSignal.value}
            </div>

        </section>
    )
}

export default PigGame;