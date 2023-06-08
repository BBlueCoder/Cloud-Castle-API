const request = require('supertest');

describe('api/health',()=>{

    let server;

    beforeEach(()=>{
        server = require('../../index');
    })

    afterEach( async () => {
        await server.close();
    })

    it('should return a success status with a message',async ()=>{
        const resp = await request(server).get('/api/health');

        expect(resp.status).toBe(200);
        expect(resp.text).toMatch(/Server is healthy/);
    })
})