import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { SentryService } from './sentry.service'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  @Inject(SentryService)
  private readonly sentryService: SentryService

  private readonly logger = new Logger(SentryInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(null, (exception) => {
        const ctx = context.switchToHttp()
        const req = ctx.getRequest()
        const res = ctx.getResponse()

        this.sentryService.handleError(exception, req, res)
        this.logger.error(`Sentry captured an error: ${exception.message}`)
      })
    )
  }
}
