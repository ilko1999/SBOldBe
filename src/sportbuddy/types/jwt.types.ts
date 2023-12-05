import { Socket } from 'socket.io';
export type JwtPayload = {
    sub: string;
    email: String;
    iat: Number;
    exp: Number;
};

export type JwtPayloadWithRT = JwtPayload & { refresh_token: string };

export type SocketWithAuth = Socket & JwtPayload;
