import {signal} from "@preact/signals-react";

const devicesSignal = signal<{videoInputs: MediaDeviceInfo[], audioInputs: MediaDeviceInfo[], audioOutputs: MediaDeviceInfo[]} | undefined>(undefined);

export default devicesSignal;