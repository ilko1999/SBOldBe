
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class EventToJoinInput {
    id?: Nullable<string>;
}

export class CreateSportInput {
    id: string;
    name?: Nullable<string>;
}

export class CreateEventDetailsInput {
    description?: Nullable<string>;
    nameOfTheEvent?: Nullable<string>;
    eventCoverPhoto?: Nullable<string>;
}

export class CreateLocationInput {
    id?: Nullable<string>;
    name?: Nullable<string>;
    latitude?: Nullable<string>;
    longitude?: Nullable<string>;
}

export class CreateEventInput {
    eventDetails: CreateEventDetailsInput;
    sport: CreateSportInput;
    maxPpl: number;
    date: string;
    time: string;
    isOpen: boolean;
    isPaid: boolean;
    location?: Nullable<CreateLocationInput>;
    createdBy?: Nullable<string>;
}

export class UpdateEventInput {
    id: number;
}

export class CreateSportbuddyInput {
    email: string;
    password: string;
    name: string;
    profileName: string;
    userPhoto?: Nullable<string>;
    isOrg?: Nullable<boolean>;
    rating?: Nullable<number>;
}

export class LoginSportsBuddyInput {
    email: string;
    password: string;
}

export class LogoutSportsBuddyInput {
    id: string;
}

export class UpdateSportbuddyInput {
    email?: Nullable<string>;
    name?: Nullable<string>;
    profileName?: Nullable<string>;
    organization?: Nullable<UpdateOrg>;
    bio?: Nullable<string>;
    website?: Nullable<string>;
    igTag?: Nullable<string>;
    ytTag?: Nullable<string>;
    interests?: Nullable<Nullable<UpdateSport>[]>;
}

export class UpdateOrg {
    id?: Nullable<string>;
    name?: Nullable<string>;
}

export class UpdateSport {
    id: string;
    name?: Nullable<string>;
}

export class CreateClubInput {
    name: string;
    desc?: Nullable<string>;
    clubCoverPhoto?: Nullable<string>;
}

export class Event {
    id?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
    userId?: Nullable<string>;
    sportId?: Nullable<string>;
    maxPpl?: Nullable<number>;
    date?: Nullable<string>;
    time?: Nullable<string>;
    isOpen?: Nullable<boolean>;
    isPaid?: Nullable<boolean>;
    usersRequestingToJoin?: Nullable<Nullable<InternalUserType>[]>;
    orgUserId?: Nullable<string>;
    organizationId?: Nullable<string>;
    EventAdditions?: Nullable<EventAdditions>;
    location?: Nullable<Location>;
    createdBy?: Nullable<InternalUserType>;
    sport?: Nullable<Sport>;
    User?: Nullable<Nullable<InternalUserType>[]>;
    numVisited?: Nullable<number>;
    Organization?: Nullable<InternalUserType>;
    hasFinished?: Nullable<boolean>;
}

export class Notification {
    id?: Nullable<string>;
    createdAt?: Nullable<Date>;
    userAwaiting?: Nullable<InternalUserType>;
    eventForUser?: Nullable<Event>;
}

export class CreatedEvent {
    id?: Nullable<string>;
}

export class InternalUserType {
    id?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
    isVerified?: Nullable<boolean>;
    email?: Nullable<string>;
    name?: Nullable<string>;
    bio?: Nullable<string>;
    profileName?: Nullable<string>;
    userPhoto?: Nullable<string>;
    role?: Nullable<string>;
    organizationId?: Nullable<string>;
    eventId?: Nullable<string>;
}

export class EventAdditions {
    description?: Nullable<string>;
    nameOfTheEvent?: Nullable<string>;
    eventCoverPhoto?: Nullable<string>;
}

export class Sport {
    id: string;
    name: string;
}

export class NewSBRequestObject {
    id: string;
    name: string;
    userPhoto?: Nullable<string>;
}

export class Location {
    id?: Nullable<string>;
    name?: Nullable<string>;
    latitude?: Nullable<string>;
    longitude?: Nullable<string>;
}

export class Message {
    createdAt?: Nullable<Date>;
    text?: Nullable<string>;
    sentBy?: Nullable<InternalUserType>;
}

export abstract class ISubscription {
    abstract newSBRequest(): NewSBRequestObject | Promise<NewSBRequestObject>;

    abstract newSportsBuddy(): Sportbuddy | Promise<Sportbuddy>;
}

export abstract class IQuery {
    abstract events(longitude?: Nullable<number>, latitude?: Nullable<number>): Nullable<Event>[] | Promise<Nullable<Event>[]>;

    abstract orgEvents(): Nullable<Nullable<Event>[]> | Promise<Nullable<Nullable<Event>[]>>;

    abstract event(id: string): Nullable<Event> | Promise<Nullable<Event>>;

    abstract notifs(): Nullable<Nullable<Notification>[]> | Promise<Nullable<Nullable<Notification>[]>>;

    abstract sports(): Nullable<Sport>[] | Promise<Nullable<Sport>[]>;

    abstract locations(): Nullable<Location>[] | Promise<Nullable<Location>[]>;

    abstract location(locationId: string): Nullable<Location> | Promise<Nullable<Location>>;

    abstract eventsUserParticipatesIn(): Nullable<Nullable<Event>[]> | Promise<Nullable<Nullable<Event>[]>>;

    abstract getMessagesOfEvent(eventId: string): Nullable<Nullable<Message>[]> | Promise<Nullable<Nullable<Message>[]>>;

    abstract sportbuddys(): Nullable<UpdatedSportsBuddy>[] | Promise<Nullable<UpdatedSportsBuddy>[]>;

    abstract sportbuddy(): Nullable<UpdatedSportsBuddy> | Promise<Nullable<UpdatedSportsBuddy>>;

    abstract getUser(user: string): Nullable<GetCertainUser> | Promise<Nullable<GetCertainUser>>;

    abstract getOrg(org: string): Nullable<SportOrg> | Promise<Nullable<SportOrg>>;

    abstract findBuddy(text: string): Nullable<SearchFieldsResultObject> | Promise<Nullable<SearchFieldsResultObject>>;

    abstract getClubs(): Nullable<Nullable<Club>[]> | Promise<Nullable<Nullable<Club>[]>>;

    abstract getClubsByString(orgId: string): Nullable<Nullable<Club>[]> | Promise<Nullable<Nullable<Club>[]>>;

    abstract getClub(clubId: string): Nullable<Club> | Promise<Nullable<Club>>;
}

export abstract class IMutation {
    abstract createEvent(createEventInput: CreateEventInput, clubId?: Nullable<string>): Nullable<Event> | Promise<Nullable<Event>>;

    abstract updateEvent(updateEventInput: UpdateEventInput): Event | Promise<Event>;

    abstract requestJoinSB(eventToJoinInput?: Nullable<EventToJoinInput>): NewSBRequestObject | Promise<NewSBRequestObject>;

    abstract removeEvent(id: number): Nullable<Event> | Promise<Nullable<Event>>;

    abstract setVisitedEvent(id: string): Nullable<Event> | Promise<Nullable<Event>>;

    abstract disconnectNotif(id: string): Nullable<Nullable<Notification>[]> | Promise<Nullable<Nullable<Notification>[]>>;

    abstract createSportbuddy(createSportbuddyInput: CreateSportbuddyInput): Sportbuddy | Promise<Sportbuddy>;

    abstract loginSportsBuddy(loginSportsBuddyInput: LoginSportsBuddyInput): Sportbuddy | Promise<Sportbuddy>;

    abstract logoutSportsBuddy(): Nullable<SportBuddyResponse> | Promise<Nullable<SportBuddyResponse>>;

    abstract rtSportsBuddy(): Nullable<Sportbuddy> | Promise<Nullable<Sportbuddy>>;

    abstract updateSportbuddy(updateSportbuddyInput: UpdateSportbuddyInput): UpdatedSportsBuddy | Promise<UpdatedSportsBuddy>;

    abstract removeSportbuddy(id: number): Nullable<Sportbuddy> | Promise<Nullable<Sportbuddy>>;

    abstract followSportbuddy(followerId: string, followedId: string): Nullable<Sportbuddy> | Promise<Nullable<Sportbuddy>>;

    abstract unfollowSportbuddy(followerId: string, followedId: string): Nullable<Sportbuddy> | Promise<Nullable<Sportbuddy>>;

    abstract createClub(createClubInput: CreateClubInput): Nullable<CreatedClub> | Promise<Nullable<CreatedClub>>;

    abstract joinClub(clubId: string): Nullable<Club> | Promise<Nullable<Club>>;
}

export class Sportbuddy {
    acces_token: string;
    refresh_token: string;
}

export class SportBuddyResponse {
    id: string;
}

export class UpdatedSportsBuddy {
    id: string;
    email: string;
    name: string;
    profileName: string;
    organization?: Nullable<UpdatedOrg>;
    bio: string;
    website?: Nullable<string>;
    igTag?: Nullable<string>;
    ytTag?: Nullable<string>;
    interests?: Nullable<Nullable<UpdatedSport>[]>;
    followedBy?: Nullable<Nullable<UpdatedSportsBuddy>[]>;
    following?: Nullable<Nullable<UpdatedSportsBuddy>[]>;
    events?: Nullable<Nullable<EventsOfUser>[]>;
    socketId?: Nullable<string>;
    oldSocketId?: Nullable<string>;
    clubs?: Nullable<Nullable<Club>[]>;
    role?: Nullable<string>;
    usersOrganization?: Nullable<UpdatedSportsBuddy>;
}

export class GetCertainUser {
    id: string;
    email: string;
    name: string;
    profileName: string;
    organization?: Nullable<UpdatedOrg>;
    bio: string;
    website: string;
    igTag: string;
    ytTag: string;
    interests?: Nullable<Nullable<UpdatedSport>[]>;
    followedBy?: Nullable<Nullable<UpdatedSportsBuddy>[]>;
    following?: Nullable<Nullable<UpdatedSportsBuddy>[]>;
    Event?: Nullable<Nullable<EventsOfUser>[]>;
    socketId?: Nullable<string>;
    oldSocketId?: Nullable<string>;
    role?: Nullable<string>;
}

export class SportOrg {
    id: string;
    email: string;
    name: string;
    profileName: string;
    bio: string;
    orgCreatedEvent?: Nullable<Nullable<EventsOfUser>[]>;
    Users?: Nullable<Nullable<UpdatedSportsBuddy>[]>;
}

export class EventsOfUser {
    id?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
    userId?: Nullable<string>;
    sportId?: Nullable<string>;
    maxPpl?: Nullable<number>;
    time?: Nullable<string>;
    date?: Nullable<string>;
    isOpen?: Nullable<boolean>;
    isPaid?: Nullable<boolean>;
    usersRequestingToJoin?: Nullable<Nullable<UpdatedSportsBuddy>[]>;
    orgUserId?: Nullable<string>;
    organizationId?: Nullable<string>;
    EventAdditions?: Nullable<EventDetails>;
    location?: Nullable<EventLoc>;
    socketId?: Nullable<string>;
    oldSocketId?: Nullable<string>;
}

export class EventDetails {
    description?: Nullable<string>;
    nameOfTheEvent?: Nullable<string>;
    eventCoverPhoto?: Nullable<string>;
}

export class EventLoc {
    id?: Nullable<string>;
    name?: Nullable<string>;
    latitude?: Nullable<string>;
    longitude?: Nullable<string>;
}

export class SearchFieldsResult {
    id?: Nullable<string>;
    name?: Nullable<string>;
    profileName?: Nullable<string>;
}

export class SearchFieldsResultObject {
    users?: Nullable<Nullable<SearchFieldsResult>[]>;
    orgs?: Nullable<Nullable<SearchFieldsResult>[]>;
}

export class UpdatedOrg {
    id?: Nullable<string>;
    profileName?: Nullable<string>;
}

export class UpdatedSport {
    id: string;
    name: string;
}

export class Club {
    id: string;
    name: string;
    desc?: Nullable<string>;
    clubCoverPhoto?: Nullable<string>;
    events?: Nullable<Nullable<EventsOfUser>[]>;
    organization?: Nullable<UpdatedSportsBuddy>;
    users?: Nullable<Nullable<GetCertainUser>[]>;
}

export class CreatedClub {
    id: string;
    name: string;
    desc?: Nullable<string>;
    clubCoverPhoto?: Nullable<string>;
}

export type Time = any;
type Nullable<T> = T | null;
