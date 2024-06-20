
function dataChannelListeners(dataChannel: RTCDataChannel) {

    if (dataChannel.label === "dummy") {
        return dataChannel.close();
    }

    dataChannel.addEventListener("open", () => {
        console.log(`${dataChannel.label} channel is ready`)
    })

    dataChannel.addEventListener("error", (event) => {
        const errorEvent = event as RTCErrorEvent;
        console.log(errorEvent.error.message);
    })

}

export default dataChannelListeners;