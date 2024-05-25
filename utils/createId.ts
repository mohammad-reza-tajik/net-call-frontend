import {v4 as uuidV4} from "uuid";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";
import {peerActions} from "@/store";

function createId({dispatch} : {dispatch : ThunkDispatch}) {

    let peerId = localStorage.getItem("peerId");
    if (!peerId) {
        peerId = uuidV4();
        localStorage.setItem("peerId", peerId)
    }
    dispatch(peerActions.setLocalPeerId(peerId));
    return peerId;
}

export default createId;