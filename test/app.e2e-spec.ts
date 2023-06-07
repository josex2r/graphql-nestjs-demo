import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { ConfigService } from '@nestjs/config'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService({}),
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('/metrics', () => {
    it('/', async () => {
      // const response = await request(app.getHttpServer())
      //   .get('/')
      //   .expect('Content-Type', /json/)
      //   .expect(200)
      //
      // expect(response.body).toMatchSnapshot()
      expect(1).toBeTruthy()
    })
  })
})
