import io from "socket.io-client";

let socket: any;

export const connectSocket = (userId: string) => {
    if (!socket) {
        socket = io(process.env.REACT_API_URL || 'http://localhost:3001', { transports: ['websocket'], query: { userId } });
    }
    return socket;
}

export { socket };