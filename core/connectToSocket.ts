import getDeviceType from "@/core/getDeviceType";
import io from "socket.io-client";
import socketListeners from "@/core/socketListeners";

function connectToSocket(localPeerId: string) {

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        query: {
            deviceType: getDeviceType(),
            localPeerId
        }
    }).connect();

    socketListeners(socket);

    return socket;
}

export default connectToSocket;