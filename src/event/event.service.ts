import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { UserType, EventType } from 'src/custom/types';
import { PrismaService } from 'src/prismaClient/prisma.service';
import { CreatedEventType, SocketWithAuth } from 'src/sportbuddy/types';
import {
    CreateEventInput,
    EventToJoinInput,
    UpdateEventInput,
} from 'src/types/graphql';
@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {}

    containsObject(obj, list) {
        var i: number;
        for (i = 0; i < list.length; i++) {
            if (list[i].id === obj.id) {
                return true;
            }
        }

        return false;
    }

    async findAllNotifs(userId: string) {
        const notifications = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                NotificationIn: {
                    include: {
                        userAwaiting: true,
                        eventForUser: {
                            include: {
                                EventAdditions: true,
                                sport: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        return notifications.NotificationIn;
    }

    async addRequest(eventId: string, userId: string) {
        const userCalling: UserType = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const res: EventType = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                User: true,
                createdBy: true,
                usersRequestingToJoin: true,
                EventAdditions: true,
            },
        });

        const userToEmitTo: UserType = await this.prisma.user.findUnique({
            where: {
                id: res.userId,
            },
        });

        let eventToJoin: EventType = null;
        let notifications = null;

        if (!this.containsObject(userCalling, res.User)) {
            eventToJoin = await this.prisma.event.update({
                data: {
                    usersRequestingToJoin: { connect: { id: userCalling.id } },
                },
                where: {
                    id: eventId,
                },
            });

            notifications = await this.prisma.user.update({
                data: {
                    NotificationIn: {
                        create: {
                            userAwaiting: {
                                connect: { id: userCalling.id },
                            },
                            eventForUser: {
                                connect: {
                                    id: eventId,
                                },
                            },
                        },
                    },
                },
                where: {
                    id: res.userId,
                },
            });
        }

        notifications = await this.prisma.user.findUnique({
            where: {
                id: res.userId,
            },
            include: {
                NotificationIn: {
                    include: {
                        userAwaiting: true,
                        eventForUser: {
                            include: {
                                EventAdditions: true,
                                sport: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        let result = {
            userToEmitToId: userToEmitTo.id,
            event: res,
            notifications: notifications.NotificationIn,
        };

        return result;
    }

    async grantAccess(
        notifId: string,
        userId: string,
        eventId: string,
        client: SocketWithAuth,
    ) {
        const eventToGrantAccesTo: EventType =
            await this.prisma.event.findUnique({
                where: {
                    id: eventId,
                },
                include: {
                    createdBy: true,
                    usersRequestingToJoin: true,
                    User: true,
                },
            });

        if (eventToGrantAccesTo.createdBy.id != client.sub) {
            throw new ForbiddenException('you are not the owner of the event');
        }

        let updatedEvent: EventType = null;
        let notifications = null;

        if (
            !this.containsObject(
                userId,
                eventToGrantAccesTo.usersRequestingToJoin,
            )
        ) {
            updatedEvent = await this.prisma.event.update({
                where: {
                    id: eventId,
                },
                include: {
                    usersRequestingToJoin: true,
                    createdBy: true,
                },
                data: {
                    User: { connect: { id: userId } },
                    usersRequestingToJoin: {
                        disconnect: { id: userId },
                    },
                },
            });

            notifications = await this.prisma.user.update({
                where: {
                    id: eventToGrantAccesTo.createdBy.id,
                },
                data: {
                    NotificationIn: {
                        delete: {
                            id: notifId,
                        },
                    },
                },
            });
        }

        notifications = await this.prisma.user.findUnique({
            where: {
                id: eventToGrantAccesTo.createdBy.id,
            },
            include: {
                NotificationIn: {
                    include: {
                        userAwaiting: true,
                        eventForUser: {
                            include: {
                                EventAdditions: true,
                                sport: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        const grantedAccessUser = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        return {
            updatedList: updatedEvent.usersRequestingToJoin,
            adminOfEvent: eventToGrantAccesTo.createdBy.id,
            grantedAccessUser: grantedAccessUser.id,
            notifications: notifications.NotificationIn,
        };
    }

    async denyAccess(
        notifId: string,
        userId: string,
        eventId: string,
        client: SocketWithAuth,
    ) {
        const eventToDenyAccesTo: EventType =
            await this.prisma.event.findUnique({
                where: {
                    id: eventId,
                },
                include: {
                    createdBy: true,
                    usersRequestingToJoin: true,
                    User: true,
                },
            });

        if (eventToDenyAccesTo.createdBy.id != client.sub) {
            throw new ForbiddenException('you are not the owner of the event');
        }

        let updatedEvent: EventType = null;
        let deniedUser: UserType = null;
        let notifications = null;

        if (
            !this.containsObject(
                userId,
                eventToDenyAccesTo.usersRequestingToJoin,
            )
        ) {
            updatedEvent = await this.prisma.event.update({
                where: {
                    id: eventId,
                },
                include: {
                    usersRequestingToJoin: true,
                },
                data: {
                    usersRequestingToJoin: {
                        disconnect: { id: userId },
                    },
                },
            });

            deniedUser = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            notifications = await this.prisma.user.update({
                where: {
                    id: eventToDenyAccesTo.createdBy.id,
                },
                data: {
                    NotificationIn: {
                        delete: {
                            id: notifId,
                        },
                    },
                },
            });
        }

        notifications = await this.prisma.user.findUnique({
            where: {
                id: eventToDenyAccesTo.createdBy.id,
            },
            include: {
                NotificationIn: {
                    include: {
                        userAwaiting: true,
                        eventForUser: {
                            include: {
                                EventAdditions: true,
                                sport: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        return {
            updatedList: updatedEvent.usersRequestingToJoin,
            adminOfEvent: eventToDenyAccesTo.createdBy.id,
            deniedUser: deniedUser.id,
            notifications: notifications.NotificationIn,
        };
    }

    async create(
        createEventInput: CreateEventInput,
        clubId: string,
        userId: string,
    ): Promise<any> {
        const userCalling: any = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (userCalling != null) {
            const newEvent = await this.prisma.event.create({
                data: {
                    sport: {
                        connect: {
                            id: createEventInput.sport.id,
                        },
                    },
                    maxPpl: createEventInput.maxPpl,
                    date: createEventInput.date,
                    time: createEventInput.time,
                    isOpen: createEventInput.isOpen,
                    isPaid: createEventInput.isPaid,
                    location: {
                        connectOrCreate: {
                            create: {
                                latitude: createEventInput.location.latitude,
                                longitude: createEventInput.location.longitude,
                                name: createEventInput.location.name,
                            },
                            where: {
                                id: createEventInput.location.id,
                            },
                        },
                    },
                    createdBy: {
                        connect: {
                            id: userId,
                        },
                    },
                    User: { connect: { id: userCalling.id } },
                    EventAdditions: {
                        create: {
                            description:
                                createEventInput.eventDetails.description,
                            nameOfTheEvent:
                                createEventInput.eventDetails.nameOfTheEvent,
                            eventCoverPhoto:
                                createEventInput.eventDetails.eventCoverPhoto,
                        },
                    },
                },
            });

            return newEvent;
        } else {
            const orgCalling: any = await this.prisma.organization.findUnique({
                where: {
                    id: userId,
                },
            });

            if (clubId != null) {
                const newEvent = await this.prisma.event.create({
                    data: {
                        sport: {
                            connect: {
                                id: createEventInput.sport.id,
                            },
                        },
                        maxPpl: createEventInput.maxPpl,
                        date: createEventInput.date,
                        time: createEventInput.time,
                        isOpen: createEventInput.isOpen,
                        isPaid: createEventInput.isPaid,
                        location: {
                            connectOrCreate: {
                                create: {
                                    latitude:
                                        createEventInput.location.latitude,
                                    longitude:
                                        createEventInput.location.longitude,
                                    name: createEventInput.location.name,
                                },
                                where: {
                                    id: createEventInput.location.id,
                                },
                            },
                        },
                        Organization: { connect: { id: orgCalling.id } },
                        club: { connect: { id: clubId } },
                        EventAdditions: {
                            create: {
                                description:
                                    createEventInput.eventDetails.description,
                                nameOfTheEvent:
                                    createEventInput.eventDetails
                                        .nameOfTheEvent,
                                eventCoverPhoto:
                                    createEventInput.eventDetails
                                        .eventCoverPhoto,
                            },
                        },
                    },
                });

                return newEvent;
            } else {
                const newEvent = await this.prisma.event.create({
                    data: {
                        sport: {
                            connect: {
                                id: createEventInput.sport.id,
                            },
                        },
                        maxPpl: createEventInput.maxPpl,
                        date: createEventInput.date,
                        time: createEventInput.time,
                        isOpen: createEventInput.isOpen,
                        isPaid: createEventInput.isPaid,
                        location: {
                            connectOrCreate: {
                                create: {
                                    latitude:
                                        createEventInput.location.latitude,
                                    longitude:
                                        createEventInput.location.longitude,
                                    name: createEventInput.location.name,
                                },
                                where: {
                                    id: createEventInput.location.id,
                                },
                            },
                        },
                        Organization: { connect: { id: orgCalling.id } },
                        EventAdditions: {
                            create: {
                                description:
                                    createEventInput.eventDetails.description,
                                nameOfTheEvent:
                                    createEventInput.eventDetails
                                        .nameOfTheEvent,
                                eventCoverPhoto:
                                    createEventInput.eventDetails
                                        .eventCoverPhoto,
                            },
                        },
                    },
                });

                return newEvent;
            }
        }
    }

    async setVisitedEvent(eventId: string) {
        const event = await this.prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                numVisited: {
                    increment: 1,
                },
            },
        });

        return event;
    }

    async findAll(userId: string, longitude?, latitude?) {
        const userCalling: any = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        var allEvents: EventType[];

        if (userCalling != null) {
            allEvents = await this.prisma.event.findMany({
                include: {
                    EventAdditions: true,
                    location: true,
                    createdBy: true,
                    sport: true,
                    usersRequestingToJoin: true,
                    User: true,
                    Organization: true,
                },
                where: {
                    Organization: null,
                },
            });
        } else {
            allEvents = await this.prisma.event.findMany({
                include: {
                    EventAdditions: true,
                    location: true,
                    createdBy: true,
                    sport: true,
                    usersRequestingToJoin: true,
                    User: true,
                    Organization: true,
                },
            });
        }

        allEvents.forEach((event) => {
            event.distance = this.haversineDistance(
                event.location.longitude,
                event.location.latitude,
                longitude,
                latitude,
            );
        });

        if (longitude != null && latitude != null) {
            allEvents.sort((a, b) => a.distance! - b.distance!);
        }

        return allEvents;
    }

    async findAllOrgEvents(orgId: string) {
        const allEvents: EventType[] = await this.prisma.event.findMany({
            include: {
                EventAdditions: true,
                location: true,
                createdBy: true,
                sport: true,
                usersRequestingToJoin: true,
            },
            where: {
                organizationId: orgId,
            },
        });

        return allEvents;
    }

    async findOne(eventId: string) {
        const certainEvent: EventType = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                usersRequestingToJoin: true,
                EventAdditions: true,
                createdBy: true,
                sport: true,
                location: true,
                User: true,
                Organization: true,
            },
        });

        return certainEvent;
    }

    async findAllSports() {
        const allSports = this.prisma.sport.findMany();
        return allSports;
    }

    async findAllLocations() {
        const allLocations = this.prisma.location.findMany();
        return allLocations;
    }

    async findOneLocation(locationId: string) {
        const certainLocation = await this.prisma.location.findUnique({
            where: {
                id: locationId,
            },
        });

        return certainLocation;
    }

    async createMessage(chatId: string, text: string, client: string) {
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
                        id: client,
                    },
                },
            },
        });
    }

    async getAllMessages(eventId: string) {
        const messages = await this.prisma.message.findMany({
            where: {
                eventId: eventId,
            },
            include: {
                sentBy: true,
            },
        });

        return messages;
    }

    update(id: number, updateEventInput: UpdateEventInput) {
        return `This action updates a #${id} event`;
    }

    remove(id: number) {
        return `This action removes a #${id} event`;
    }

    async getEventsUserParticipatesIn(userId: string) {
        const events = await this.prisma.event.findMany({
            where: {
                User: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: { EventAdditions: true },
        });

        return events;
    }

    async sendMessageToChat(text: string, eventId: string, userId: string) {
        const message = await this.prisma.message.create({
            data: {
                text: text,
                Event: {
                    connect: {
                        id: eventId,
                    },
                },
                sentBy: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        const messages = await this.prisma.message.findMany({
            where: {
                eventId: eventId,
            },
        });

        return messages;
    }

    haversineDistance(long1, lat1, long2, lat2) {
        var R = 6371; // radius of Earth in kilometers

        var dlat = (lat2 - lat1) * (Math.PI / 180);
        var dlong = (long2 - long1) * (Math.PI / 180);
        var a =
            Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dlong / 2) *
                Math.sin(dlong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = R * c;
        return distance;
    }

    async getEventUsers(eventId: string) {
        const users = await this.prisma.event.findFirst({
            where: {
                id: eventId,
            },
            include: {
                User: true,
            },
        });

        return { users };
    }
}
