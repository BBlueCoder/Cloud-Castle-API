jest.mock('../../../utils/redis-api');

const User = require('../../../db/users-crud');
const FilesController = require('../../../controllers/files-controller');
const request = require('supertest');
const pool = require('../../../db-pool');
const config = require('config');
const FileController = require('../../../controllers/files-controller');
const fs = require('fs').promises;
const redisAPI = require('../../../utils/redis-api');
const jwt = require('jsonwebtoken');

describe('files cache test', () => {

    let server;
    let token;
    let resp, req;
    let fileController;
    let filesResult;
    let userId;

    const testUser = new User("testuser", "testpassword");
    const storagePath = config.get("storagePath");

    beforeAll(async () => {
        await testUser.signup();
        server = require('../../../index');
        token = await testUser.login();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        userId = decoded.data.id;

        filesResult = await request(server)
            .post('/api/files')
            .set('authentication', token)
            .attach('files', 'files-samples/sample_video.mp4')
            .attach('files', 'files-samples/sample_text.txt');

        req = {
            userId: userId,
            params: {
                fileId: filesResult.body[0].id
            },
            query: {
                file_type: '',
                sort_order: 'asc'
            }
        };

        resp = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        fileController = new FileController(req, resp);
        
    })

    beforeEach(() => {
        redisAPI.get.mockReset();
        redisAPI.add.mockClear();

        resp.json.mockClear();

        redisAPI.get.mockImplementation(async (key, value, expiresInSeconds = null) => {
            return null;
        })

        redisAPI.add.mockImplementation(async (key) => {
            return "OK";
        })
    })

    afterAll(async () => {
        await server.close();
        await testUser.deleteUser();
        await redisAPI.clearAll();
        await pool.end();

        //removing storage contents
        try {
            await fs.rm(storagePath, { recursive: true });
        } catch (error) {
            console.log(error);
        }
    })

    describe('getFile data', () => {
        it('should cache result after retreive it from db', async () => {
            await fileController.getFileData();

            expect(redisAPI.get).toHaveBeenCalled();
            expect(redisAPI.get).toHaveBeenCalledWith(`files-metadata-${userId}-${filesResult.body[0].id}`);
            expect(redisAPI.add).toHaveBeenCalled();
            expect(redisAPI.add).toHaveBeenCalledWith(`files-metadata-${userId}-${filesResult.body[0].id}`, filesResult.body[0], 60 * 10);
        })

        it('should retrieve result from cache', async () => {
            redisAPI.get.mockImplementation(async (key, value, expiresInSeconds = null) => {
                return filesResult.body[0];
            })

            await fileController.getFileData();

            const resultFromCall = await redisAPI.get.mock.results[0].value;

            expect(redisAPI.get).toHaveBeenCalled();
            expect(resultFromCall).toEqual(filesResult.body[0]);
            expect(redisAPI.add).not.toHaveBeenCalled();
        })
    })

    describe('getFiles', () => {

        it('should cache result after retreive it from db', async () => {
            await fileController.getFiles();

            const key = `files-${userId}-${req.query.sort_order}-${req.query.file_type}`;

            expect(redisAPI.get).toHaveBeenCalled();
            expect(redisAPI.get).toHaveBeenCalledWith(key);
            expect(redisAPI.add).toHaveBeenCalled();
        })

        it('should retrieve result from cache', async () => {
            redisAPI.get
                .mockImplementationOnce(async (key, value, expiresInSeconds = null) => {
                    return filesResult.body;
                })
                .mockImplementationOnce(async (key, value, expiresInSeconds = null) => {
                    return [
                        filesResult.body[1].id
                    ];
                })

            await fileController.getFiles();

            const key = `files-${userId}-${req.query.sort_order}-${req.query.file_type}`;

            expect(redisAPI.get).toHaveBeenCalled();
            expect(redisAPI.get.mock.calls[0][0]).toBe(key);
            expect(redisAPI.get.mock.calls[1][0]).toBe(`files-removed-${userId}`);
            expect(redisAPI.add).not.toHaveBeenCalled();
            expect(resp.json.mock.calls[0][0].length).toBe(1);
        })
    })

    describe('getFilesWithPaging', () => {

        beforeAll(() => {
            req = {
                userId: userId,
                params: {
                    fileId: filesResult.body[0].id
                },
                query: {
                    file_type: '',
                    sort_order: 'desc',
                    limit: '25',
                    offset: '0'
                }
            };

            fileController = new FileController(req, resp);

        })

        it('should cache result after retreive it from db', async () => {
            await fileController.getFiles();

            const key = `files-paging-${userId}-desc-${req.query.limit}-${req.query.offset}-${req.query.file_type}`
            expect(redisAPI.get).toHaveBeenCalled();
            expect(redisAPI.get).toHaveBeenCalledWith(key);
            expect(redisAPI.add).toHaveBeenCalled();

        })

        it('should retrieve result from cache', async () => {
            redisAPI.get
                .mockImplementationOnce(async (key, value, expiresInSeconds = null) => {
                    return filesResult.body;
                })
                .mockImplementationOnce(async (key, value, expiresInSeconds = null) => {
                    return [
                        filesResult.body[1].id
                    ];
                })

            const key = `files-paging-${userId}-desc-${req.query.limit}-${req.query.offset}-${req.query.file_type}`

            await fileController.getFiles();

            expect(redisAPI.get).toHaveBeenCalled();
            expect(redisAPI.get.mock.calls[0][0]).toBe(key);
            expect(redisAPI.get.mock.calls[1][0]).toBe(`files-removed-${userId}`);
            expect(redisAPI.add).not.toHaveBeenCalled();
            expect(resp.json.mock.calls[0][0].length).toBe(1);
        })
    })

    describe('deleteFile', () => {

        beforeEach(() => {
            redisAPI.remove.mockClear();

            redisAPI.remove.mockImplementation(async (key) => {
                return true;
            })
        })
        it('should remove file metadata from cache', async () => {
            await fileController.deleteFile();

            const key = `files-metadata-${filesResult.body[0].id}`;

            expect(redisAPI.remove).toHaveBeenCalled();
            expect(redisAPI.remove).toHaveBeenCalledWith(key);
        })
    })

    describe('deleteFiles', () => {

        beforeAll(() => {
            req = {
                userId: userId,
                body: [
                    filesResult.body[1]
                ]
            };

            fileController = new FileController(req, resp);
        })

        it('should add files to removed files list', async () => {
            await fileController.deleteFiles();

            const key = `files-removed-${userId}`;

            expect(redisAPI.get).toHaveBeenCalled();
            expect(redisAPI.get).toHaveBeenCalledWith(key);
            expect(redisAPI.add).toHaveBeenCalled();
            expect(redisAPI.add.mock.calls[0][1][0]).toBe(filesResult.body[1].id);
        })
    })

})