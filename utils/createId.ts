import randomInt from "@/utils/randomInt";
function createId(idLength: number) {

    const allCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:',.<>?";

    let peerId = localStorage.getItem("peerId") || "";

    if (!peerId) {
        for (let i = 0; i < idLength; i++) {
            peerId += Array.from(allCharacters).at(randomInt(0, allCharacters.length - 1));
        }
        localStorage.setItem("peerId", peerId)
    }

    return peerId;

}

export default createId;