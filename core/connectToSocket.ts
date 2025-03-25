import io from "socket.io-client";
import socketListeners from "@/core/socketListeners";
import type { IConnectedPeer } from "@/types";

interface IConnectToSocketParams extends Omit<IConnectedPeer, "socketId"> {}

function connectToSocket({ localPeerId, deviceType, visibility }: IConnectToSocketParams) {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    query: {
      deviceType,
      localPeerId,
      visibility,
    },
  });

  socketListeners(socket);

  return socket;
}

export default connectToSocket;
