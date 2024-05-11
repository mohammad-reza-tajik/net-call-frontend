async function getDevices() {

    await navigator.mediaDevices.getUserMedia({ video: true  ,audio: true })
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === "videoinput");
    const audioInputs = devices.filter(device => device.kind === "audioinput");
    const audioOutputs = devices.filter(device => device.kind === "audiooutput");

    return {videoInputs, audioInputs , audioOutputs};
}

export default getDevices;