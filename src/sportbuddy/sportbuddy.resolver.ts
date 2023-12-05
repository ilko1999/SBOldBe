import { HttpCode, HttpStatus, Inject, Req, UseGuards } from '@nestjs/common';
import {
    Resolver,
    Query,
    Mutation,
    Args,
    Context,
    Subscription,
} from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions/dist/redis-pubsub';
import { text } from 'node:stream/consumers';
import { pubsub } from 'src/pubsub/pubsub.module';
import {
    CreateClubInput,
    CreateSportbuddyInput,
    LoginSportsBuddyInput,
    LogoutSportsBuddyInput,
    SportBuddyResponse,
    UpdateSportbuddyInput,
} from 'src/types/graphql';
import { CurrentUser, Public } from './decorators';
import { SportbuddyService } from './sportbuddy.service';
import { AtStrategy, RtStrategy } from './strategies';
import { SubscriptionEvents, Tokens } from './types';

@Resolver('Sportbuddy')
export class SportbuddyResolver {
    constructor(
        private readonly sportbuddyService: SportbuddyService,
        @Inject(pubsub) private readonly pubSub: RedisPubSub,
    ) {}

    @Public()
    @Mutation('createSportbuddy')
    @HttpCode(HttpStatus.CREATED)
    register(
        @Args('createSportbuddyInput')
        createSportbuddyInput: CreateSportbuddyInput,
    ): Promise<Tokens> {
        const newSportsBuddy = this.sportbuddyService.register(
            createSportbuddyInput,
        );
        this.pubSub.publish(SubscriptionEvents.newSportsBuddy, {
            newSportsBuddy: createSportbuddyInput,
        });
        return newSportsBuddy;
    }

    @Public()
    @Subscription()
    newSportsBuddy() {
        return this.pubSub.asyncIterator(SubscriptionEvents.newSportsBuddy);
    }

    @Public()
    @Mutation('loginSportsBuddy')
    @HttpCode(HttpStatus.OK)
    login(
        @Args('loginSportsBuddyInput')
        loginSportsbuddyInput: LoginSportsBuddyInput,
    ): Promise<Tokens> {
        return this.sportbuddyService.login(loginSportsbuddyInput);
    }

    @Mutation('logoutSportsBuddy')
    @HttpCode(HttpStatus.OK)
    logout(@Context('req') req) {
        this.sportbuddyService.logout(req.user['sub']);
    }

    @Public()
    @UseGuards(RtStrategy)
    @Mutation('rtSportsBuddy')
    @HttpCode(HttpStatus.OK)
    rtRefresh(
        @Context('req') req,
        @CurrentUser('refresh_token') refreshToken: string,
    ): Promise<Tokens> {
        return this.sportbuddyService.rtRefresh(req.user['sub'], refreshToken);
    }

    @Query('sportbuddy')
    findAll() {
        return this.sportbuddyService.findAll();
    }

    @Query('sportbuddy')
    findOne(@Context('req') req) {
        return this.sportbuddyService.findOne(req.user['sub']);
    }

    @Query('getUser')
    getUser(
        @Args('user')
        user: string,
    ) {
        return this.sportbuddyService.getUser(user);
    }

    @Query('getOrg')
    getOrg(
        @Args('org')
        org: string,
    ) {
        return this.sportbuddyService.getOrg(org);
    }

    @Query('findBuddy')
    findTheBuddy(
        @Args('text')
        text: string,
    ) {
        return this.sportbuddyService.findTheBuddy(text);
    }

    @Mutation('updateSportbuddy')
    update(
        @Context('req') req,
        @Args('updateSportbuddyInput')
        updateSportbuddyInput: UpdateSportbuddyInput,
    ) {
        return this.sportbuddyService.update(
            req.user['sub'],
            updateSportbuddyInput,
        );
    }

    @Mutation('removeSportbuddy')
    remove(@Args('id') id: number) {
        return this.sportbuddyService.remove(id);
    }

    @Mutation('followSportbuddy')
    follow(
        @Args('followerId') followerId: string,
        @Args('followedId') followedId: string,
    ) {
        return this.sportbuddyService.follow(followerId, followedId);
    }

    @Mutation('unfollowSportbuddy')
    unfollow(
        @Args('followerId') followerId: string,
        @Args('followedId') followedId: string,
    ) {
        return this.sportbuddyService.unfollow(followerId, followedId);
    }

    @Mutation('createClub')
    async createClub(
        @Args('createClubInput') createClubInput: CreateClubInput,
        @Context('req') req,
    ): Promise<any> {
        const newClub = await this.sportbuddyService.createClub(
            req.user['sub'],
            createClubInput,
        );
        return newClub;
    }

    @Query('getClubs')
    findAllClubs() {
        return this.sportbuddyService.findAllClubs();
    }

    @Query('getClubsByString')
    findAllClubsByString(@Args('orgId') orgId: string) {
        return this.sportbuddyService.findAllClubsByString(orgId);
    }

    @Query('getClub')
    findClub(@Args('clubId') clubId: string) {
        return this.sportbuddyService.findClub(clubId);
    }

    @Mutation('joinClub')
    async joinClub(
        @Args('clubId') clubId: string,
        @Context('req') req,
    ): Promise<any> {
        const joinedClub = await this.sportbuddyService.joinClub(
            req.user['sub'],
            clubId,
        );
        return joinedClub;
    }
}
