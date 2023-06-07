const env = process.env

export type Configuration = {
  PORT: number
  DASHBOARD_ORIGIN: string

  SENTRY_DSN?: string
  SENTRY_ENVIRONMENT?: string
  SENTRY_RELEASE?: string
}

export default () =>
  ({
    PORT: env.PORT ? Number(env.PORT) : 8080,
    DASHBOARD_ORIGIN: env.DASHBOARD_ORIGIN || 'https://foo-bar-wow.ikea.net',

    SENTRY_DSN: env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: env.SENTRY_ENVIRONMENT,
    SENTRY_RELEASE: env.SENTRY_RELEASE,
  } as Configuration)
