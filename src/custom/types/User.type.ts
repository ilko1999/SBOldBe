import { EventType, Sport } from './Event.types';

export type UserType = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isVerified: Boolean;
    email: string;
    name: string;
    bio: string;
    profileName: string;
    hash: string;
    hashedRt: string;
    userPhoto: string;
    role: string;
    organizationId: string;
    eventId?: string;
    Event?: EventType[];
    socketId?: string;
    oldSocketId?: string;
    achievments?: Achievment[];
    interests?: Sport[];
    notifications?: Notification[];
};

export type OrganizationType = {
    email: string;
    name: string;
    bio: string;
    profileName: string;
    organization: string;
    hash: string;
    hashedRt: string;
    userPhoto: string;
    role: Role;
    orgCreatedEvent: EventType[];
    orgSubmitedEvents: EventType[];
    Users: UserType[];
    socketId?: string;
};

export type Notification = {
    id: string;
    createdAt: Date;
    User: UserType;
    userId: string;
    Event: EventType;
    eventId: string;
};

export type Achievment = {
    achievmentPhoto: string;
    achievmentDescription: string;
    achievmentName: string;
};

export enum Role {
    MEMBER = 'MEMBER',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN',
}
