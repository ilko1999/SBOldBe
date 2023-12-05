import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { ServerOptions } from 'socket.io';
import { SocketWithAuth } from 'src/sportbuddy/types';

export class SocketIoAdapter extends IoAdapter {
    private readonly logger = new Logger(SocketIoAdapter.name);
    constructor(
        private app: INestApplicationContext,
        private configService: ConfigService,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const cors = {
            origin: '*',
        };

        this.logger.log(
            'Configuring SocketIO server with custom CORS options',
            {
                cors,
            },
        );
        const optionsWithCORS: ServerOptions = {
            ...options,
            cors,
        };

        const jwtService = this.app.get(JwtService);
        const server: Server = super.createIOServer(port, optionsWithCORS);

        server
            .of('sport_events')
            .use(createTokenMiddleware(jwtService, this.logger));
        return server;
    }
}

const createTokenMiddleware =
    (jwtService: JwtService, logger: Logger) =>
    (socket: SocketWithAuth, next) => {
        // for Postman testing support, fallback to token header
        const token =
            socket.handshake.auth.token || socket.handshake.headers['token'];

        logger.debug(`Validating auth token before connection: ${token}`);

        try {
            const payload = jwtService.verify(token, {
                secret: 'at-secret',
            });
            socket.sub = payload.sub;
            socket.email = payload.email;
            next();
        } catch {
            next(new Error('FORBIDDEN'));
        }
    };
