import {createSlice} from "@reduxjs/toolkit";

const initialState   = {
    isOpen: false,
};

const drawerSlice = createSlice({
    name: "drawer",
    initialState,
    reducers : {
        openDrawer(state) {
            state.isOpen = true;
        },
        closeDrawer(state) {
            state.isOpen = false
        }
    }
})

export const drawerActions = drawerSlice.actions;

export default drawerSlice