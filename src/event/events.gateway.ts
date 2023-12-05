import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { EventService } from './event.service';
import { SportbuddyService } from 'src/sportbuddy/sportbuddy.service';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/sportbuddy/types';
import { EventType, UserType } from 'src/custom/types';
import { PrismaService } from 'src/prismaClient/prisma.service';

@WebSocketGateway({
    namespace: 'sport_events',
})
export class SportEventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(SportEventsGateway.name);

    constructor(
        private readonly sportsbuddyService: SportbuddyService,
        private readonly eventService: EventService,
        private prisma: PrismaService,
    ) {}

    @WebSocketServer() io: Namespace;

    afterInit(): void {
        this.logger.log('Websocket gateway initialized 🚪');
    }

    handleConnection(client: SocketWithAuth) {
        const sockets = this.io.sockets;
        this.logger.log(
            `WS client with id ${client.id} ${client.sub} ${client.email} connected`,
        );
        this.logger.debug(`num of connected sockets ${sockets.size}`);

        // this.eventService.refreshSocketId(client.sub, client.id);

        client.join(client.sub);

        this.io.to(client.id).emit('zdravei', client.id);
    }

    handleDisconnect(client: SocketWithAuth) {
        const sockets = this.io.sockets;
        this.logger.log(
            `WS client with id ${client.id} ${client.sub} ${client.email} disconnected`,
        );
        this.logger.debug(`num of connected sockets ${sockets.size}`);

        // this.eventService.refreshSocketId(client.sub, '');
    }

    @SubscribeMessage('request_access')
    async requestAccess(
        @MessageBody('id') eventId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(
            `user with the email ${client.email} is requesting acces to  event with id of ${eventId}`,
        );

        const { userToEmitToId, notifications } =
            await this.eventService.addRequest(eventId, client.sub);

        this.io.to(userToEmitToId).emit('user_queue', notifications);
    }

    @SubscribeMessage('grant_access')
    async grantAccess(
        @MessageBody('notifId') notifId: string,
        @MessageBody('userId') userId: string,
        @MessageBody('eventId') eventId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(
            `user with the email ${client.sub} is granting acces to user with sub `,
        );

        const { grantedAccessUser, notifications, adminOfEvent } =
            await this.eventService.grantAccess(
                notifId,
                userId,
                eventId,
                client,
            );

        this.io
            .to(grantedAccessUser)
            .emit('grant_access', { grantedAccess: true });
        this.io.to(adminOfEvent).emit('updated_notif', notifications);
    }

    @SubscribeMessage('deny_access')
    async denyAccess(
        @MessageBody('notifId') notifId: string,
        @MessageBody('userId') userId: string,
        @MessageBody('eventId') eventId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(
            `user with the email ${client.sub} is granting acces to user with sub `,
        );

        const { updatedList, adminOfEvent, deniedUser, notifications } =
            await this.eventService.denyAccess(
                notifId,
                userId,
                eventId,
                client,
            );

        // this.io.to(adminOfEvent).emit('deny_access', updatedList);
        this.io
            .to(deniedUser)
            .emit('deny_access', { userId, grantedAccess: false });
        this.io.to(adminOfEvent).emit('updated_notif', notifications);
    }

    @SubscribeMessage('follow_user')
    async followUser(
        @MessageBody('userId') userId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(
            `user with the email ${client.email} is following user with id ${userId}`,
        );

        const { user, userToEmitTo } = await this.sportsbuddyService.follow(
            client.sub,
            userId,
        );
        this.io.to(userToEmitTo).emit('followers_queue', user);
    }

    @SubscribeMessage('send_org_notifs')
    async sendOrganizationalNotifs(
        @MessageBody('eventId') eventId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(
            `org with the email ${client.email} is sending notifs to everyone connected with them`,
        );
        const { users, event, org } = await this.sportsbuddyService.getOrgUsers(
            client.sub,
            eventId,
        );

        users.forEach((user) => {
            this.io.to(user.id).emit('recieve_org_notifs', { event, org });
        });
    }

    @SubscribeMessage('enter_chat')
    async enterChat(
        @MessageBody('chatId') chatId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(`entering chat ${chatId}`);

        client.join(chatId);
        this.io.to(chatId).emit('connected to chat');
    }

    @SubscribeMessage('send_message')
    async sendMessage(
        @MessageBody('chatId') chatId: string,
        @MessageBody('text') text: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(`entering chat ${chatId}`);

        const message = await this.prisma.message.create({
            data: {
                text: text,
                Event: {
                    connect: {
                        id: chatId,
                    },
                },
                sentBy: {
                    connect: {
                        id: client.sub,
                    },
                },
            },
        });

        const messages = await this.prisma.message.findMany({
            where: {
                eventId: chatId,
            },
            include: {
                sentBy: true,
            },
        });

        this.io.to(chatId).emit('messages', messages);
    }

    @SubscribeMessage('new_events')
    async newEvent(
        @MessageBody('eventId') eventId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(`entering chat ${eventId} ${client.sub}`);

        const users = await this.prisma.user.findMany();

        console.log(users);

        users.forEach((user) => {
            this.io.to(user.id).emit('newEvent', eventId);
        });
    }

    @SubscribeMessage('complete_event')
    async completeEvent(
        @MessageBody('eventId') eventId: string,
        @ConnectedSocket() client: SocketWithAuth,
    ) {
        this.logger.debug(`closing event event ${eventId}`);

        const { users } = await this.eventService.getEventUsers(eventId);

        console.log(users);

        users.User.forEach((user) => {
            const randomUser = this.prisma.user.findMany();
            this.io.to(user.id).emit('rating', eventId);
        });
    }
}
