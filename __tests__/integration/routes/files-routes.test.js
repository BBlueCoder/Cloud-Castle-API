const request = require('supertest');
const User = require('../../../db/users-crud');
const config = require('config');
const pool = require('../../../db-pool');
const fs = require('fs').promises;
const redisAPI = require('../../../utils/redis-api');

describe('/api/files', () => {
   
    let server;
    let token;
    let fileId;
    let contentType;

    const testUser = new User("testuser", "testpassword");
    const storagePath = config.get("storagePath");

    beforeAll(async () => {
        await testUser.signup();
    })

    beforeEach(async () => {
        server = require('../../../index');
        token = await testUser.login();
    })

    afterEach(async () => {
        await server.close();
        await redisAPI.clearAll();
    })

    afterAll(async () => {
        await testUser.deleteUser();
        await pool.end();

        //removing storage contents
        try {
            await fs.rm(storagePath, { recursive: true });
        } catch (error) {
            console.log(error);
        }
    })

    describe('post', () => {
        it('should return 401 status when the request sent without token', async () => {
            const resp = await request(server).post('/api/files');

            expect(resp.status).toBe(401);
            expect(resp.body.Message).toMatch(/No token was found/);
        })

        it('should return 400 status when sending empty request', async () => {
            const resp = await request(server)
                .post('/api/files')
                .set('authentication', token);

            expect(resp.status).toBe(400);
            expect(resp.body.Message).toMatch(/No files found/);
        })

        it('should return 200 status and the metadata of the uploaded files', async () => {
            const resp = await request(server)
                .post('/api/files')
                .set('authentication', token)
                .attach('files', 'files-samples/sample_video.mp4')
                .attach('files', 'files-samples/sample_text.txt');

            expect(resp.status).toBe(200);
            expect(resp.body).toHaveLength(2);

            expect(resp.body[0]).toHaveProperty('id');
            expect(resp.body[0]).toHaveProperty('savedname');
            expect(resp.body[0]).toHaveProperty('originname');
            expect(resp.body[0]).toHaveProperty('filetype');
            expect(resp.body[0]).toHaveProperty('contentlength');
            expect(resp.body[0]).toHaveProperty('dateinmillis');
            expect(resp.body[0]).toHaveProperty('duration');

            //for testing fetching file by an Id, save the id of the first file
            fileId = resp.body[0].id;
            //same for contentType
            contentType = resp.body[0].filetype;
        })

    })

    describe('get files',() => {
        it('should return 401 status when the request sent without token', async () => {
            const resp = await request(server).get('/api/files');

            expect(resp.status).toBe(401);
            expect(resp.body.Message).toMatch(/No token was found/);
        })

        it('should return all files of the user', async () => {
            const resp = await request(server)
                .get('/api/files')
                .set('authentication', token);

            expect(resp.status).toBe(200);
            expect(resp.body).toHaveLength(2);
        })
    })

    describe('get file metadata',() => {
        it('should return 404 status when if the file not found', async () => {
            const resp = await request(server)
                .get('/api/files/metadata/-3')
                .set('authentication', token);

            expect(resp.status).toBe(404);
            expect(resp.body.Message).toMatch(/not found/);
        })

        it('should return file metadata', async () => {
            const resp = await request(server)
                .get('/api/files/metadata/'+fileId)
                .set('authentication', token);

            expect(resp.status).toBe(200);

            expect(resp.body).toHaveProperty('id');
            expect(resp.body).toHaveProperty('savedname');
            expect(resp.body).toHaveProperty('originname');
            expect(resp.body).toHaveProperty('filetype');
            expect(resp.body).toHaveProperty('contentlength');
            expect(resp.body).toHaveProperty('dateinmillis');
            expect(resp.body).toHaveProperty('duration');
        })
    })

    describe('get file',()=>{
        it('should return 404 status when if the file not found', async () => {
            const resp = await request(server)
                .get('/api/files/-3')
                .set('authentication', token);

            expect(resp.status).toBe(404);
            expect(resp.body.Message).toMatch(/not found/);
        })

        it('should return the file', async () => {
            const resp = await request(server)
                .get('/api/files/'+fileId)
                .set('authentication', token);

            expect(resp.status).toBe(200);
            expect(resp.headers['content-type']).toBe(contentType);
        })
    })

    describe('get file thumbnail',()=>{
        it('should return 404 status when if the file not found', async () => {
            const resp = await request(server)
                .get('/api/files/thumbnail/-3')
                .set('authentication', token);

            expect(resp.status).toBe(404);
            expect(resp.body.Message).toMatch(/not found/);
        })

        it('should return 400 status when the file do not have a thumbnail', async () => {
            //fileId is the id of the video, so to get the id of the text file we add 1 to the fileId
            const resp = await request(server)
                .get('/api/files/thumbnail/'+(fileId+1))
                .set('authentication', token);

            expect(resp.status).toBe(400);
            expect(resp.body.Message).toBe("File doesn't have a thumbnail");
        })

        it('should return the thumbnail', async () => {
            const resp = await request(server)
                .get('/api/files/thumbnail/'+fileId)
                .set('authentication', token);

            expect(resp.status).toBe(200);
            expect(resp.headers['content-type']).toBe("image/jpeg");
        })
    })

    describe('delete file by id',()=>{
        it('should return 404 status when if the file not found', async () => {
            const resp = await request(server)
                .delete('/api/files/-3')
                .set('authentication', token);

            expect(resp.status).toBe(404);
            expect(resp.body.Message).toMatch(/not found/);
        })

        it('should return success', async () => {
            const resp = await request(server)
                .delete('/api/files/'+fileId)
                .set('authentication', token);

            expect(resp.status).toBe(200);
        })
    })

    describe('delete files using request body',()=>{
        it('should return 400 status if request sent with no body', async () => {
            const resp = await request(server)
                .delete('/api/files')
                .set('authentication', token);

            expect(resp.status).toBe(400);
            expect(resp.body.Message).toMatch(/No files found/);
        })

        it('should return success', async () => {
            const deleteFiles = [{
                id : fileId+1
            }]
            const resp = await request(server)
                .delete('/api/files')
                .set('authentication', token)
                .send(deleteFiles);

            expect(resp.status).toBe(200);
        })
    })
})