import {configureStore} from "@reduxjs/toolkit";
import drawerSlice from "@/store/drawerSlice";
import peerSlice from "@/store/peerSlice";
import {drawerActions} from "@/store/drawerSlice";
import {peerActions} from "@/store/peerSlice";
import {useDispatch, useSelector , type TypedUseSelectorHook} from "react-redux";


type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppDispatch: () => AppDispatch = useDispatch
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


const store = configureStore({
    reducer: {
        drawer: drawerSlice.reducer,
        peer : peerSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['your/action/type'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ["payload.socket","payload.stream","payload.peerConnection","payload.videoRef.current","payload.iceCandidates","payload"],
                // Ignore these paths in the state
                ignoredPaths: ["peer.peerConnection","peer.socket","peer.stream","peer.videoRef.current","peer.iceCandidates","payload"],
            },
        }),
})

/**
* we create an index file so to import everything related to redux
* from a single place.
* this makes our life as a developer much easier .
* now in every component that we need to interact with our store we
* can import everything from here.
* */


export { store , useAppDispatch , useAppSelector, drawerActions , peerActions }