import { User } from '@prisma/client';
import { UserType, OrganizationType } from './User.type';

export type EventType = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    sportId: string;
    maxPpl: Number;
    time: String;
    date: String;

    isOpen: boolean;
    isPaid: boolean;
    usersRequestingToJoin?: UserType[];
    orgUserId: String;
    organizationId: String;
    User?: UserType[];
    createdBy?: UserType;
    EventAdditions?: EventAdditions;
    location?: Location;
    distance?: number;
};

export type Sport = {
    id: string;
    name: string;
};

export type Location = {
    id: string;
    name: string;
    longitude: string;
    latitude: string;
};

export type EventAdditions = {
    description: string;
    nameOfTheEvent: string;
    eventCoverPhoto: string;
};
