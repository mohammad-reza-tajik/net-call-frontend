import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import gameChannelListeners from "@/core/gameChannelListeners";
import dataChannelListeners from "@/core/dataChannelListeners";
import {isYourTurnSignal} from "@/signals/games/pigGame";
import {batch} from "@preact/signals-react";
import statusSignal from "@/signals/peer/status";
import toast from "react-hot-toast";
import createConnection from "@/core/createConnection";

async function inviteToGame() {
    try {

        peerConnectionSignal.value = createConnection();


        if (!peerConnectionSignal.value) {
            throw new Error("no peer connection");
        }

        const gameChannel = peerConnectionSignal.value.createDataChannel("game");
        dataChannelListeners(gameChannel);
        gameChannelListeners(gameChannel);

        isYourTurnSignal.value = true;

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);

        batch(() => {
            statusSignal.value = "game:send";
            offerSignal.value = offer;
        });


    } catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
            console.error(err);
        }
    }}

export default inviteToGame;