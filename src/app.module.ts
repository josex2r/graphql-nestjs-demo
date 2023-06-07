import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

import { recipesPubsub } from './common/pubsub/recipes.pubsub'
import configuration, { Configuration } from './config/configuration'
import { RecipesModule } from './recipes/recipes.module'
import { SentryInterceptor } from './sentry/sentry.interceptor'
import { SentryMiddleware } from './sentry/sentry.middleware'
import { SentryModule } from './sentry/sentry.module'

@Module({
  imports: [
    // ENV vars
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Sentry error tracking
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
    // GraphQL
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: false,
        subscriptions: {
          'graphql-ws': true,
        },
        plugins: configService.get('GRAPHQL_PLAYGROUND', { infer: true })
          ? [ApolloServerPluginLandingPageLocalDefault()]
          : [],
        context: (ctx) => {
          return { ...ctx, recipesPubsub: recipesPubsub }
        },
      }),
      inject: [ConfigService],
    }),
    // App modules
    RecipesModule,
  ],
  // App cofiguration
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
