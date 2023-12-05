import { Module } from '@nestjs/common';
import { SportbuddyService } from './sportbuddy.service';
import { SportbuddyResolver } from './sportbuddy.resolver';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AccesTokenStrategy } from './strategies/at.tokenStrategy';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenStrategy } from './strategies/rt.tokenStrategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AccesTokenStrategy,
    RefreshTokenStrategy,
    SportbuddyService,
    SportbuddyResolver,
    ConfigService,
    { provide: APP_GUARD, useClass: AtStrategy },
  ],
  exports: [SportbuddyService]
})
export class SportbuddyModule {}
