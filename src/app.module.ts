import { MiddlewareConsumer, Module } from '@nestjs/common'
import { SentryMiddleware } from './sentry/sentry.middleware'
import { SentryModule } from './sentry/sentry.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration, { Configuration } from './config/configuration'
import { SentryInterceptor } from './sentry/sentry.interceptor'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SentryModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService<Configuration>) {
        const dsn = configService.get('SENTRY_DSN', { infer: true })
        const environment = configService.get('SENTRY_ENVIRONMENT', {
          infer: true,
        })
        const release = configService.get('SENTRY_RELEASE', {
          infer: true,
        })

        return {
          enabled: true,
          dsn,
          environment,
          release,
        }
      },
    }),
  ],
  controllers: [],
  providers: [
    // Setup Sentry error middleware
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Setup Sentry request middleware
    consumer.apply(SentryMiddleware).forRoutes('*')
  }
}
