import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators/modules/global.decorator';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const pubsub = 'pubsub';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: pubsub,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
    },
  ],
  exports: [pubsub],
})
export class PubsubModule {}
