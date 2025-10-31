import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/exceptions';


describe('Authors API (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(new AllExceptionsFilter());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });
    it('should create an author and then retrieve it by ID', async () => {
        const createAuthorDto = {
            firstName: 'John',
            lastName: 'Doe',
            bio: 'A prolific writer',
            birthDate: '1980-05-20',
        };
        // create author
        const createResponse = await request(app.getHttpServer())
            .post('/authors')
            .send(createAuthorDto)
            .expect(HttpStatus.CREATED);

        expect(createResponse.body).toHaveProperty('_id');

        const authorId = createResponse.body._id;

        // get author
        const getResponse = await request(app.getHttpServer())
            .get(`/authors/${authorId}`)
            .expect(HttpStatus.OK);

        // Check author
        expect(getResponse.body._id).toBe(authorId);
        expect(getResponse.body.firstName).toBe(createAuthorDto.firstName);

        // Delete the created author
        await request(app.getHttpServer())
            .delete(`/authors/${authorId}`)
            .expect(HttpStatus.NO_CONTENT);
    });
});
