import { DynamicModule, Module } from '@nestjs/common'

import { SENTRY_MODULE_OPTIONS } from './sentry.constants'
import { SentryService } from './sentry.service'

export type SentryModuleOptions = {
  enabled: boolean
  dsn: string
  environment: string
  release: string
}

export type SentryModuleAsyncOptions = {
  inject: any[]
  useFactory: (...args: any[]) => SentryModuleOptions
}

function createSentryProviders(options: SentryModuleOptions) {
  return [
    {
      provide: SENTRY_MODULE_OPTIONS,
      useValue: options,
    },
  ]
}

function createSentryAsyncProviders(options: SentryModuleAsyncOptions) {
  return [
    {
      provide: SENTRY_MODULE_OPTIONS,
      ...options,
    },
  ]
}

@Module({})
export class SentryModule {
  public static forRoot(options: SentryModuleOptions): DynamicModule {
    const providers = createSentryProviders(options)

    return {
      module: SentryModule,
      providers: [...providers, SentryService],
      exports: [...providers, SentryService],
    }
  }

  public static forRootAsync(options: SentryModuleAsyncOptions): DynamicModule {
    const providers = createSentryAsyncProviders(options)

    return {
      module: SentryModule,
      providers: [...providers, SentryService],
      exports: [...providers, SentryService],
    }
  }
}
