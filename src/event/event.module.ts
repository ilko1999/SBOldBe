import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { SportEventsGateway } from './events.gateway';
import { SportbuddyService } from 'src/sportbuddy/sportbuddy.service';
import { SportbuddyModule } from 'src/sportbuddy/sportbuddy.module';

@Module({
    providers: [EventResolver, EventService, SportEventsGateway],
    imports: [SportbuddyModule]
})
export class EventModule {}
