import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './custom/socketio';
import { urlencoded, json } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = parseInt(configService.get('PORT'));
    const clientPort = parseInt(configService.get('CLIENT_PORT'));
    app.useGlobalPipes(new ValidationPipe());

    app.enableCors({
        origin: '*',
    });
    app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    await app.listen(port);
}
bootstrap();
