const request = require('supertest');
const User = require('../../../db/users-crud');
const pool = require('../../../db-pool');
const redisAPI = require('../../../utils/redis-api');

describe('/api/users', () => {
    const testUser = new User('testuser', 'Test@password');
    let userBody;
    let server;

    beforeEach(() => {
        server = require('../../../index');
        userBody = {
            username: testUser.username,
            password: testUser.password,
        };
    });

    afterEach(async () => {
        await testUser.deleteUser();
        await server.close();
        await redisAPI.clearAll();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('signup', () => {
        it('should return 400 status because no valid body sent', async () => {
            const resp = await request(server).post('/api/users/signup');
            expect(resp.status).toBe(400);
            expect(resp.body.Message).toBeDefined();
        });

        it('should return 406 status when username is duplicated', async () => {
            let resp = await request(server).post('/api/users/signup').send(userBody);
            expect(resp.status).toBe(200);

            resp = await request(server).post('/api/users/signup').send(userBody);
            expect(resp.status).toBe(406);
            expect(resp.body.Message).toMatch(/Username is duplicated/);
        });

        it('should return a json web token', async () => {
            const resp = await request(server)
                .post('/api/users/signup')
                .send(userBody);

            expect(resp.status).toBe(200);
            expect(resp.body.token).toMatch(
                /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
            );
        });
    });

    describe('login', () => {
        beforeEach(async () => {
            await testUser.signup();
        });

        it('should return 400 status because no valid body sent', async () => {
            const resp = await request(server).post('/api/users/login');
            expect(resp.status).toBe(400);
            expect(resp.body.Message).toBeDefined();
        });

        it('should return 404 status when username is not found', async () => {
            userBody.username = 'invalid';
            const resp = await request(server)
                .post('/api/users/login')
                .send(userBody);

            expect(resp.status).toBe(404);
            expect(resp.body.Message).toMatch(/User not found/);
        });

        it('should return 401 status when password is incorrect', async () => {
            userBody.password = 'Invalid@';
            const resp = await request(server)
                .post('/api/users/login')
                .send(userBody);

            expect(resp.status).toBe(401);
            expect(resp.body.Message).toMatch(/Password/);
        });

        it('should return a json web token when valid body sent', async () => {
            const resp = await request(server)
                .post('/api/users/login')
                .send(userBody);

            expect(resp.status).toBe(200);
            expect(resp.body.token).toMatch(
                /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
            );
        });
    });
});
