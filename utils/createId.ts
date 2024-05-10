import {v4 as uuidV4} from "uuid";

function createId() {

    let peerId = localStorage.getItem("peerId");
    if (!peerId) {
        peerId = uuidV4();
        localStorage.setItem("peerId", peerId)
    }
    return peerId;
}

export default createId;