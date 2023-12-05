import { Inject } from '@nestjs/common';
import {
    Resolver,
    Query,
    Mutation,
    Args,
    Context,
    Subscription,
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { UserType } from 'src/custom/types';
import { pubsub } from 'src/pubsub/pubsub.module';
import { Public } from 'src/sportbuddy/decorators';
import { CreatedEventType, SubscriptionEvents } from 'src/sportbuddy/types';
import {
    CreateEventInput,
    EventToJoinInput,
    UpdateEventInput,
} from 'src/types/graphql';
import { EventService } from './event.service';

@Resolver('Event')
export class EventResolver {
    constructor(
        private readonly eventService: EventService,
        @Inject(pubsub) private readonly pubSub: RedisPubSub,
    ) {}

    @Mutation('createEvent')
    async create(
        @Args('createEventInput') createEventInput: CreateEventInput,
        @Args('clubId') clubId: string,
        @Context('req') req,
    ): Promise<any> {
        const newEvent = await this.eventService.create(
            createEventInput,
            clubId,
            req.user['sub'],
        );
        return newEvent;
    }

    @Mutation('requestJoinSB')
    async addRequest(
        @Args('eventToJoinInput') eventToJoinInput: EventToJoinInput,
        @Context('req') req,
    ): Promise<any> {
        const newNotif = await this.eventService.addRequest(
            eventToJoinInput.id,
            req.user['sub'],
        );

        this.pubSub.publish(SubscriptionEvents.newSBRequest, {
            newSBRequest: newNotif,
        });

        return newNotif;
    }

    @Public()
    @Subscription()
    newSBRequest() {
        return this.pubSub.asyncIterator(SubscriptionEvents.newSBRequest);
    }

    @Mutation('setVisitedEvent')
    async setVisitedEvent(@Args('id') id: string): Promise<any> {
        const myEvent = await this.eventService.setVisitedEvent(id);
        return myEvent;
    }

    @Query('notifs')
    findAllNotifs(@Context('req') req) {
        return this.eventService.findAllNotifs(req.user['sub']);
    }

    @Query('getMessagesOfEvent')
    getMessagesOfEvent(@Args('eventId') eventId: string) {
        return this.eventService.getAllMessages(eventId);
    }

    @Query('events')
    findAll(
        @Context('req') req,
        @Args('longitude') longitude?: number,
        @Args('latitude') latitude?: number,
    ) {
        return this.eventService.findAll(req.user['sub'], longitude, latitude);
    }

    @Query('orgEvents')
    findAllOrgEvents(@Context('req') req) {
        return this.eventService.findAllOrgEvents(req.user['sub']);
    }

    @Query('event')
    findOne(@Args('id') id: string) {
        return this.eventService.findOne(id);
    }

    @Query('eventsUserParticipatesIn')
    getEventsUserParticipatesIn(@Context('req') req) {
        return this.eventService.getEventsUserParticipatesIn(req.user['sub']);
    }

    @Mutation('updateEvent')
    update(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
        return this.eventService.update(updateEventInput.id, updateEventInput);
    }

    @Mutation('removeEvent')
    remove(@Args('id') id: number) {
        return this.eventService.remove(id);
    }

    @Query('sports')
    findAllSports() {
        return this.eventService.findAllSports();
    }

    @Query('locations')
    findAllLocations() {
        return this.eventService.findAllLocations();
    }

    @Query('location')
    findOneLocation(@Args('locationId') locationId: string) {
        return this.eventService.findOneLocation(locationId);
    }
}
