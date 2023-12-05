import { Module } from '@nestjs/common';
import { PrismaModule } from './prismaClient/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { SportbuddyModule } from './sportbuddy/sportbuddy.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EventModule } from './event/event.module';
import { PubsubModule } from './pubsub/pubsub.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            signOptions: {
                expiresIn: 3600,
            },
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            cors: {
                origin: '*',
                credentials: true,
            },
            driver: ApolloDriver,
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            subscriptions: {
                'graphql-ws': true,
                'subscriptions-transport-ws': true,
            },
            typePaths: ['./**/*.graphql'],
            definitions: {
                path: join(process.cwd(), 'src/types/graphql.ts'),
                outputAs: 'class',
            },
            context: ({ req }) => ({ req }),
        }),
        PrismaModule,
        SportbuddyModule,
        EventModule,
        PubsubModule,
    ],
})
export class AppModule {}
