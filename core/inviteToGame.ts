import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import gameChannelListeners from "@/core/gameChannelListeners";
import dataChannelListeners from "@/core/dataChannelListeners";
import {isYourTurnSignal} from "@/signals/games/pigGame";
import {batch} from "@preact/signals-react";
import statusSignal from "@/signals/peer/status";

async function inviteToGame() {
    try {

        if (!peerConnectionSignal.value) {
            throw new Error("no peer connection");
        }

        const gameChannel = peerConnectionSignal.value!.createDataChannel("game");
        dataChannelListeners(gameChannel);
        gameChannelListeners(gameChannel);

        isYourTurnSignal.value = true;

        const offer = await peerConnectionSignal.value!.createOffer();
        await peerConnectionSignal.value!.setLocalDescription(offer);

        batch(() => {
            statusSignal.value = "game:send";
            offerSignal.value = offer;
        })


    } catch (err) {
        console.log(err);
    }
}

export default inviteToGame;