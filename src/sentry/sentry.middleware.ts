import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { SentryService } from './sentry.service'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  @Inject(SentryService)
  private readonly sentryService: SentryService

  use(req: Request, res: Response, next: NextFunction) {
    this.sentryService.handleRequest(req, res, next)
  }
}
