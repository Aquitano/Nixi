/* eslint-disable import/no-extraneous-dependencies */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AddHighlightDto, CreateArticleDto, EditArticleDto } from '../src/article/dto';
import { SupertokensExceptionFilter } from '../src/auth/auth.filter';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

const authCookie: string[] = [];

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new SupertokensExceptionFilter());

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto = {
      email: 'test@test.mee',
      password: 'dX87@V5w*XLcY6',
    };
    describe('Signup', () => {
      it('should throw if email empty', () =>
        pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400));
      it('should throw if password empty', () =>
        pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400));
      it('should throw if no body provided', () =>
        pactum.spec().post('/auth/signup').expectStatus(400));
      it('should signup', () =>
        pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            formFields: [
              { id: 'email', value: dto.email },
              { id: 'password', value: dto.password },
            ],
          })
          .expectStatus(200));
    });

    describe('Login', () => {
      it('should throw if email empty', () =>
        pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400));
      it('should throw if password empty', () =>
        pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400));
      it('should throw if no body provided', () =>
        pactum.spec().post('/auth/signin').expectStatus(400));
      it('should login', async () => {
        const cookie: string[] = await pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            formFields: [
              { id: 'email', value: dto.email },
              { id: 'password', value: dto.password },
            ],
          })
          .expectStatus(200)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        authCookie.push(...cookie);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () =>
        pactum
          .spec()
          .get('/users/me')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(200));
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Vladimir',
        };
        return pactum
          .spec()
          .patch('/users')
          .withCookies(authCookie[0])
          .withCookies(authCookie[1])
          .withCookies(authCookie[2])
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName);
      });
    });
  });

  describe('Articles', () => {
    describe('Get empty articles', () => {
      it('should get articles', () =>
        pactum
          .spec()
          .get('/articles')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(200)
          .expectBody([]));
    });

    describe('Create article', () => {
      const dto: CreateArticleDto = {
        title: `This 30-year-old makes $114,000 a month in passive income: \u20184 businesses you can start today for $99 or less'`,
        link: 'https://www.cnbc.com/2022/08/23/i-make-119000-a-month-in-passive-income-here-are-businesses-you-can-start-for-99-dollars-or-less.html',
        author: 'Charlie Chang',
        top_image_url:
          'https://image.cnbcfm.com/api/v1/image/107048403-1650379684091-Lifestyle-3.jpg?v=1652360136&w=1920&h=1080',
        favorite: false,
        word_count: 888,
        content: `Hello World! XSS Test: <a href="javascript:alert('XSS')">Click Me</a>`,
      };
      it('should create article', () =>
        pactum
          .spec()
          .post('/articles')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .withBody(dto)
          .expectStatus(201)
          .stores('articleId', 'id')
          .expectBodyContains(`Hello World! XSS Test: <a>Click Me</a>`)); // XSS protection test
    });

    describe('Get articles', () => {
      it('should get articles', () =>
        pactum
          .spec()
          .get('/articles')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(200)
          .expectJsonLength(1));
    });

    describe('Get article by id', () => {
      it('should get article by id', () =>
        pactum
          .spec()
          .get('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(200)
          .expectBodyContains('$S{articleId}'));
    });

    describe('Edit article by id', () => {
      const dto: EditArticleDto = {
        title: 'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
        content: `Hello World! XSS Test: <a href="javascript:alert('XSS')">Click Me</a>`,
      };
      it('should edit article', () =>
        pactum
          .spec()
          .patch('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(`Hello World! XSS Test: <a>Click Me</a>`)); // XSS protection test
    });

    describe('Add highlight', () => {
      // get store variable outside of pactum

      const dto: AddHighlightDto = {
        content: 'Learn how to use Kubernetes',
        start: 0,
        end: 27,
        articleId: 0,
      };
      it('should add highlight', () =>
        pactum
          .spec()
          .post('/articles/highlights/{id}')
          .withPathParams('id', '$S{articleId}')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .withBody({ ...dto, articleId: '$S{articleId}' })
          .expectStatus(201)
          .stores('highlightId', 'id'));
    });

    describe('Get highlights', () => {
      it('should get highlights', () =>
        pactum
          .spec()
          .get('/articles/highlights/{id}')
          .withPathParams('id', '$S{articleId}')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(200)
          .expectJsonLength(1));
    });

    describe('Delete highlight', () => {
      it('should delete highlight', () =>
        pactum
          .spec()
          .delete('/articles/highlights/{id}')
          .withPathParams('id', '$S{highlightId}')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(200));
    });

    describe('Delete article by id', () => {
      it('should delete article', () =>
        pactum
          .spec()
          .delete('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(204));

      it('should get empty article', () =>
        pactum
          .spec()
          .get('/articles')
          .withCookies(authCookie[0])
          .withCookies(authCookie[2])
          .expectStatus(200)
          .expectJsonLength(0));
    });
  });
});
