import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prismaClient/prisma.service';
import {
    CreateClubInput,
    CreateSportbuddyInput,
    LoginSportsBuddyInput,
    LogoutSportsBuddyInput,
    UpdateSportbuddyInput,
} from 'src/types/graphql';

import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { OrganizationType, UserType } from 'src/custom/types';
import { Club } from '@prisma/client';

@Injectable()
export class SportbuddyService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60 * 60 * 24 * 7,
                },
            ),

            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: 60 * 60 * 24 * 7,
                },
            ),
        ]);

        return {
            acces_token: at,
            refresh_token: rt,
        };
    }

    async register(
        createSportbuddyInput: CreateSportbuddyInput,
    ): Promise<Tokens> {
        console.log(createSportbuddyInput);
        if (!createSportbuddyInput.isOrg) {
            const hash = await this.hashData(createSportbuddyInput.password);
            const newUser = await this.prisma.user.create({
                data: {
                    email: createSportbuddyInput.email,
                    name: createSportbuddyInput.name,
                    profileName: createSportbuddyInput.profileName,
                    hash,
                },
            });

            const tokens = await this.getTokens(newUser.id, newUser.email);
            await this.updateRtHash(
                createSportbuddyInput.isOrg,
                newUser.id,
                tokens.refresh_token,
            );
            return tokens;
        } else {
            const hash = await this.hashData(createSportbuddyInput.password);
            const newOrg = await this.prisma.organization.create({
                data: {
                    email: createSportbuddyInput.email,
                    name: createSportbuddyInput.name,
                    profileName: createSportbuddyInput.profileName,
                    hash,
                },
            });

            const tokens = await this.getTokens(newOrg.id, newOrg.email);
            await this.updateRtHash(
                createSportbuddyInput.isOrg,
                newOrg.id,
                tokens.refresh_token,
            );
            return tokens;
        }
    }

    async updateRtHash(isOrg: boolean, userId: string, rt: string) {
        if (!isOrg) {
            const hash = await this.hashData(rt);
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    hashedRt: hash,
                },
            });
        } else {
            const hash = await this.hashData(rt);
            await this.prisma.organization.update({
                where: {
                    id: userId,
                },
                data: {
                    hashedRt: hash,
                },
            });
        }
    }

    async login(loginSportsBuddyInput: LoginSportsBuddyInput): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginSportsBuddyInput.email,
            },
        });

        const organization = await this.prisma.organization.findUnique({
            where: {
                email: loginSportsBuddyInput.email,
            },
        });

        if (user) {
            const passwordMatches = await bcrypt.compare(
                loginSportsBuddyInput.password,
                user.hash,
            );

            if (!passwordMatches) throw new ForbiddenException('Acces Denied');

            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(false, user.id, tokens.refresh_token);
            return tokens;
        } else if (!user && !organization) {
            throw new ForbiddenException('Acces Denied');
        } else if (organization && !user) {
            const passwordMatches = await bcrypt.compare(
                loginSportsBuddyInput.password,
                organization.hash,
            );

            if (!passwordMatches) throw new ForbiddenException('Acces Denied');

            const tokens = await this.getTokens(
                organization.id,
                organization.email,
            );
            await this.updateRtHash(
                true,
                organization.id,
                tokens.refresh_token,
            );
            return tokens;
        } else if (!organization) {
            throw new ForbiddenException('Acces Denied');
        }
    }

    async logout(userId: string) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null,
                },
            },
            data: {
                hashedRt: null,
            },
        });
    }

    async rtRefresh(userId: string, userRt: string): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const organization = await this.prisma.organization.findUnique({
            where: {
                id: userId,
            },
        });

        if (user) {
            const rtMatches = await bcrypt.compare(userRt, user.hashedRt);
            if (!rtMatches) throw new ForbiddenException('Acces Denied!');

            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(false, user.id, tokens.refresh_token);
            return tokens;
        } else if (!user && !organization) {
            throw new ForbiddenException('Acces Denied');
        } else if (organization && !user) {
            const rtMatches = await bcrypt.compare(
                userRt,
                organization.hashedRt,
            );
            if (!rtMatches) throw new ForbiddenException('Acces Denied!');

            const tokens = await this.getTokens(
                organization.id,
                organization.email,
            );
            await this.updateRtHash(
                true,
                organization.id,
                tokens.refresh_token,
            );
            return tokens;
        } else if (!organization) {
            throw new ForbiddenException('Acces Denied');
        }
    }

    findAll() {
        return `This action returns all sportbuddy`;
    }

    async findOne(userId: string) {
        const certainUser: UserType = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                interests: true,
                usersOrganization: true,
            },
        });

        if (certainUser) {
            return certainUser;
        } else {
            const organization = await this.prisma.organization.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    clubs: true,
                },
            });

            return organization;
        }
    }

    async getOrgUsers(orgId: string, eventId: string) {
        const orgCalling = await this.prisma.organization.findUnique({
            where: {
                id: orgId,
            },
            include: {
                Users: true,
            },
        });

        const Event = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                EventAdditions: true,
            },
        });

        return { users: orgCalling.Users, event: Event, org: orgCalling };
    }

    async getUser(user: string) {
        const certainUser: UserType = await this.prisma.user.findUnique({
            where: {
                profileName: user,
            },
            include: {
                interests: true,
                followedBy: true,
                following: true,
                Event: {
                    include: {
                        EventAdditions: true,
                    },
                },
            },
        });

        return certainUser;
    }

    async getOrg(org: string) {
        const certainUser: any = await this.prisma.organization.findUnique({
            where: {
                profileName: org,
            },
            include: {
                orgCreatedEvent: {
                    include: {
                        EventAdditions: true,
                    },
                },
                Users: true,
            },
        });

        return certainUser;
    }

    async update(userId: string, updateSportbuddyInput: UpdateSportbuddyInput) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const organization = await this.prisma.organization.findUnique({
            where: {
                id: userId,
            },
        });
        let certainUser: UserType = null;
        let certainOrganization: any = null;
        const updatedUser: UserType = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                interests: true,
            },
        });

        var final = updatedUser.interests.filter(function (item) {
            return !updateSportbuddyInput.interests.includes(item);
        });

        if (user) {
            if (!final) {
                certainUser = await this.prisma.user.update({
                    data: {
                        email: updateSportbuddyInput.email || undefined,
                        name: updateSportbuddyInput.name || undefined,
                        profileName:
                            updateSportbuddyInput.profileName || undefined,
                        usersOrganization: {
                            connect: {
                                id: updateSportbuddyInput.organization.id,
                            },
                        },
                        interests: {
                            disconnect: updateSportbuddyInput.interests.map(
                                (interest) => ({
                                    id: interest.id,
                                }),
                            ),
                        },
                        bio: updateSportbuddyInput.bio || undefined,
                        website: updateSportbuddyInput.website || undefined,
                        igTag: updateSportbuddyInput.igTag || undefined,
                        ytTag: updateSportbuddyInput.ytTag || undefined,
                    },
                    where: {
                        id: userId,
                    },
                });
            } else {
                certainUser = await this.prisma.user.update({
                    data: {
                        email: updateSportbuddyInput.email || undefined,
                        name: updateSportbuddyInput.name || undefined,
                        profileName:
                            updateSportbuddyInput.profileName || undefined,
                        usersOrganization: {
                            connect: {
                                id: updateSportbuddyInput.organization.id,
                            },
                        },
                        interests: {
                            set: updateSportbuddyInput.interests.map(
                                (interest) => ({
                                    id: interest.id,
                                }),
                            ),
                        },
                        bio: updateSportbuddyInput.bio || undefined,
                        website: updateSportbuddyInput.website || undefined,
                        igTag: updateSportbuddyInput.igTag || undefined,
                        ytTag: updateSportbuddyInput.ytTag || undefined,
                    },
                    where: {
                        id: userId,
                    },
                });
            }
            return certainUser;
        } else if (!user && !organization) {
            throw new NotFoundException('No user found');
        } else if (organization && !user) {
            certainOrganization = await this.prisma.organization.update({
                data: {
                    email: updateSportbuddyInput.email || undefined,
                    name: updateSportbuddyInput.name || undefined,
                    profileName: updateSportbuddyInput.profileName || undefined,

                    bio: updateSportbuddyInput.bio || undefined,
                },
                where: {
                    id: userId,
                },
            });
            return certainOrganization;
        }
    }

    remove(id: number) {
        return `This action removes a #${id} sportbuddy`;
    }

    async findTheBuddy(text: string) {
        if (text !== '') {
            const users = await this.prisma.user.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                startsWith: text,
                            },
                        },
                        {
                            profileName: {
                                startsWith: text,
                            },
                        },
                    ],
                },
                take: 5,
            });

            const orgs = await this.prisma.organization.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                startsWith: text,
                            },
                        },
                        {
                            profileName: {
                                startsWith: text,
                            },
                        },
                    ],
                },
                take: 5,
            });

            const result = { users: users, orgs: orgs };

            return result;
        } else return null;
    }

    async follow(followerId: string, followedId: string) {
        const user: UserType = await this.prisma.user.update({
            where: { id: followerId },
            data: {
                following: {
                    connect: {
                        id: followedId,
                    },
                },
            },
        });

        const userToEmitTo: UserType = await this.prisma.user.findUnique({
            where: {
                id: followedId,
            },
        });

        return {
            user: user,
            userToEmitTo: userToEmitTo.id,
        };
    }

    async unfollow(followerId: string, followedId: string) {
        await this.prisma.user.update({
            where: { id: followerId },
            data: {
                following: {
                    disconnect: {
                        id: followedId,
                    },
                },
            },
        });
    }

    async createClub(organizationId: string, createClubInput: CreateClubInput) {
        const newClub = await this.prisma.club.create({
            data: {
                name: createClubInput.name,
                desc: createClubInput.desc,
                clubCoverPhoto: createClubInput.clubCoverPhoto,
                organization: {
                    connect: {
                        id: organizationId,
                    },
                },
            },
        });

        return newClub;
    }

    async findAllClubs() {
        const allClubs: Club[] = await this.prisma.club.findMany({
            include: {
                organization: true,
                users: true,
            },
        });

        return allClubs;
    }

    async findAllClubsByString(orgId: string) {
        const allClubs: Club[] = await this.prisma.club.findMany({
            where: {
                organization: {
                    id: orgId,
                },
            },
            include: {
                organization: true,
                users: true,
            },
        });

        return allClubs;
    }

    async findClub(clubId: string) {
        const club: Club = await this.prisma.club.findUnique({
            where: {
                id: clubId,
            },
            include: {
                organization: true,
                events: {
                    include: {
                        EventAdditions: true,
                    },
                },
                users: true,
            },
        });

        return club;
    }

    async joinClub(userId: string, clubId: string) {
        const joinedClub = await this.prisma.club.update({
            where: { id: clubId },
            data: {
                users: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        const clubEvents = await this.prisma.event.findMany({
            where: {
                clubId: clubId,
            },
        });

        await Promise.all(
            clubEvents.map(async (event) => {
                await this.prisma.event.update({
                    where: {
                        id: event.id,
                    },
                    data: {
                        User: {
                            connect: {
                                id: userId,
                            },
                        },
                    },
                });
            }),
        );

        return joinedClub;
    }
}
