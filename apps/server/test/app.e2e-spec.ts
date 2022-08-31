/* eslint-disable import/no-extraneous-dependencies */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { CreateArticleDto, EditArticleDto } from '../src/article/dto';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

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
    const dto: AuthDto = {
      email: 'test@test.me',
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
      it('should signup', () => pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201));
    });

    describe('Login', () => {
      it('should throw if email empty', () =>
        pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400));
      it('should throw if password empty', () =>
        pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400));
      it('should throw if no body provided', () =>
        pactum.spec().post('/auth/login').expectStatus(400));
      it('should login', () =>
        pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token'));
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () =>
        pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200));
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Vladimir',
          email: 'new@test.me',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Articles', () => {
    describe('Get empty articles', () => {
      it('should get articles', () =>
        pactum
          .spec()
          .get('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]));
    });

    describe('Create article', () => {
      const dto: CreateArticleDto = {
        title: 'First Article',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
      };
      it('should create article', () =>
        pactum
          .spec()
          .post('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('articleId', 'id'));
    });

    describe('Get articles', () => {
      it('should get articles', () =>
        pactum
          .spec()
          .get('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1));
    });

    describe('Get article by id', () => {
      it('should get article by id', () =>
        pactum
          .spec()
          .get('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{articleId}'));
    });

    describe('Edit article by id', () => {
      const dto: EditArticleDto = {
        title: 'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      it('should edit article', () =>
        pactum
          .spec()
          .patch('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description));
    });

    describe('Delete article by id', () => {
      it('should delete article', () =>
        pactum
          .spec()
          .delete('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204));

      it('should get empty article', () =>
        pactum
          .spec()
          .get('/articles')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0));
    });
  });
});
