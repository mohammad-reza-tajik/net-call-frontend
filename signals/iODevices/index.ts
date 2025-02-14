import {signal} from "@preact/signals-react";

const iODevicesSignal = signal<{videoInputs: MediaDeviceInfo[], audioInputs: MediaDeviceInfo[], audioOutputs: MediaDeviceInfo[]} | undefined>(undefined);

export default iODevicesSignal;