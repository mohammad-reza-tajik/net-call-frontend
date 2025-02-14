async function getIODevices() {

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === "videoinput");
    const audioInputs = devices.filter(device => device.kind === "audioinput");
    const audioOutputs = devices.filter(device => device.kind === "audiooutput");

    return {videoInputs, audioInputs , audioOutputs};
}

export default getIODevices;