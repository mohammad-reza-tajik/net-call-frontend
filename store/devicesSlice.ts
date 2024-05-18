import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Devices} from "@/types";

const initialState: Devices   = {
    audioInputs: undefined,
    audioOutputs: undefined,
    videoInputs: undefined,
    currentVideoInput: undefined,
    currentAudioInput: undefined,
    currentAudioOutput: undefined,
};

const devicesSlice = createSlice({
    name: "devices",
    initialState,
    reducers : {
        setAudioInputs(state , action: PayloadAction<Devices["audioInputs"]>) {
            state.audioInputs = action.payload;
        },
        setAudioOutputs(state , action: PayloadAction<Devices["audioOutputs"]>) {
            state.audioInputs = action.payload;
        },
        setVideoInputs(state , action: PayloadAction<Devices["videoInputs"]>) {
            state.videoInputs = action.payload;
        },
        setCurrentVideoInput(state , action: PayloadAction<Devices["currentVideoInput"]>) {
            state.currentVideoInput = action.payload;
        },
        setCurrentAudioInput(state , action: PayloadAction<Devices["currentAudioInput"]>) {
            state.currentAudioInput = action.payload;
        },
        setCurrentAudioOutput(state, action: PayloadAction<Devices["currentAudioOutput"]>) {
            state.currentAudioOutput = action.payload;
        }
    }
})

export const devicesActions = devicesSlice.actions;

export default devicesSlice