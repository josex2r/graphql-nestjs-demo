import * as Sentry from '@sentry/node'
import { Inject, Injectable } from '@nestjs/common'
import { SentryModuleOptions } from './sentry.module'
import { SENTRY_MODULE_OPTIONS } from './sentry.constants'
import { RequestHandler } from '@nestjs/common/interfaces'
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'

@Injectable()
export class SentryService {
  private requestHandler: RequestHandler

  private errorHandler: ErrorRequestHandler

  constructor(@Inject(SENTRY_MODULE_OPTIONS) private options: SentryModuleOptions) {
    this.requestHandler = Sentry.Handlers.requestHandler()
    this.errorHandler = Sentry.Handlers.errorHandler()

    this.initSentry()
  }

  initSentry() {
    if (!this.options.enabled) {
      return
    }

    const { dsn, environment, release } = this.options

    Sentry.init({
      dsn,
      environment,
      release,
      integrations: [new Sentry.Integrations.Http()],
    })
  }

  handleRequest(req: Request, res: Response, next: NextFunction) {
    this.requestHandler(req, res, next)
  }

  handleError(error: Error, req: Request, res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.errorHandler(error, req, res, () => {})
  }
}
