"use client"

import {Button} from "@/components/ui/button";
import {Plus} from "@/components/shared/Icons";
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
import {batch} from "@preact/signals-react";


const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]; // Unicode dice symbols

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

    function restartGameHandler() {
        batch(() => {
            isYourTurnSignal.value = true;
            diceSignal.value = 1;
            opponentScoreSignal.value = 0;
            temporaryScoreSignal.value = 0;
            myScoreSignal.value = 0;
            isGameOverSignal.value = false;
        });
        gameChannelSignal.value?.send(JSON.stringify({type: "restartGame"}));
    }

    return (
        <section className={"flex flex-col justify-between items-center gap-5 size-full relative"}>

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


            <p className={"text-9xl"}>
                {diceFaces[diceSignal.value - 1]}
            </p>

            <div className={"border rounded size-12 flex justify-center items-center text-xl"}>
                {temporaryScoreSignal.value}
            </div>

            <div className={"flex items-center justify-center gap-5"}>
                <Button className={"gap-2"} onClick={rollDiceHandler} disabled={!isYourTurnSignal.value}>
                    <span className={"text-2xl"}>
                        {diceFaces[4]}
                    </span>
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