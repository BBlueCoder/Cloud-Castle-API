const auth = require('../../../middlewares/authentificate-user');
const User = require('../../../db/users-crud');

describe('authentificate user middleware',()=>{

    const user = new User('testUser','12345');

    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODM4MzEyNzUsImRhdGEiOnsiaWQiOjMsInVzZXJuYW1lIjoidXNlcjIifSwiaWF0IjoxNjgzODI5MTc1fQ.NQsJKWEq4HtS8UyHaR6zkDLtbmAVvH3FiKTBX0CCxd4'
    const invalidToken = 'eyJhbGciOiJIUzI1sInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODM4MzEyNzUsImRhdGEiOnsiaWQiOjMsInVzZXJuYW1lIjoidXNlcjIifSwiaWF0IjoxNjgzODI5MTc1fQ.NQsJKWEq4HtS8UyHaR6zkDLtbmAVvH3FiKTBX0CCxd4'
    
    let token;
    let res;

    beforeEach(() => {
        res = {
            status : jest.fn( () => res),
            json : jest.fn()
        };
    })
    
    it('should return 401 status and a message contains "No token was found"',()=>{
        token = '';

        const req = {
            headers : {
                authentication : token
            }
        };

        auth(req, res, () => {});

        const Message = res.json.mock.calls[0][0].Message;

        expect(res.status).toHaveBeenCalledWith(401);
        expect(Message).toMatch(/No token was found/);
    })

    it('should return 401 status and a message contains "token is invalid"',()=>{
        token = invalidToken;

        const req = {
            headers : {
                authentication : token
            }
        };

        auth(req, res, () => {});

        const Message = res.json.mock.calls[0][0].Message;

        expect(res.status).toHaveBeenCalledWith(401);
        expect(Message).toMatch(/token is invalid/);  
    })

    it('should return 401 status and a message contains "token is expired"',()=>{
        token = expiredToken;

        const req = {
            headers : {
                authentication : token
            }
        };

        auth(req, res, () => {});

        const Message = res.json.mock.calls[0][0].Message;

        expect(res.status).toHaveBeenCalledWith(401);
        expect(Message).toMatch(/token is expired/);  
    })

    it('should add user id to req body',()=>{
        token = user.generateJWT({ id : 1, username : 'testUser' });

        const req = {
            headers : {
                authentication : token
            }
        };

        const next = jest.fn();

        auth(req, {}, next);

        expect(req.userId).toBe(1);
        expect(next).toHaveBeenCalled();
    })
})