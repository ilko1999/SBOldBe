import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload, JwtPayloadWithRT } from '../types';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRT | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (data) return req.user['refresh_token'];

    return req.user;
  },
);
