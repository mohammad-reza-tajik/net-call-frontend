import {signal} from "@preact/signals-react";
import io from "socket.io-client";
import getDeviceType from "@/utils/getDeviceType";
import localPeerId from "@/signals/peer/localPeerId";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    query: {
        deviceType: getDeviceType(),
        localPeerId
    }
}).connect();

const socketSignal = signal(socket);


export default socketSignal