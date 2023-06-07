import { Test, TestingModule } from '@nestjs/testing'
import { SENTRY_MODULE_OPTIONS } from './sentry.constants'
import { SentryService } from './sentry.service'
import * as Sentry from '@sentry/node'

jest.mock('@sentry/node', () => ({
  Integrations: { Http: jest.fn() },
  Handlers: {
    requestHandler: jest.fn().mockReturnValue(jest.fn()),
    tracingHandler: jest.fn().mockReturnValue(jest.fn()),
    errorHandler: jest.fn().mockReturnValue(jest.fn()),
  },
  init: jest.fn(),
}))

describe('SentryService', () => {
  let service: SentryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentryService,
        {
          provide: SENTRY_MODULE_OPTIONS,
          useValue: {
            enabled: true,
            dsn: 'dsn',
            environment: 'env',
            release: 'release',
          },
        },
      ],
    }).compile()

    service = module.get<SentryService>(SentryService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('setups Sentry with env values', async () => {
    expect(Sentry.init).toBeCalledWith(
      expect.objectContaining({
        dsn: 'dsn',
        environment: 'env',
        release: 'release',
      })
    )
  })
})
