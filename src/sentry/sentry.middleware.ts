import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { SentryService } from './sentry.service'

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  @Inject(SentryService)
  private readonly sentryService: SentryService

  use(req: Request, res: Response, next: NextFunction) {
    this.sentryService.handleRequest(req, res, next)
  }
}
