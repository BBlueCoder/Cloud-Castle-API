const validateUser = require('../../../middlewares/validate-user-request');

describe('validate user request middleware', () => {
    let req, resp, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        resp = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return an error if username field is missing', () => {
        validateUser(req, resp, next);

        const error = resp.json.mock.calls[0][0].Error;

        expect(resp.status).toHaveBeenCalledWith(400);
        expect(error).toMatch(/Username/);
    });

    it('should return an error if password field is missing', () => {
        req.body.username = 'testuser';

        validateUser(req, resp, next);

        const error = resp.json.mock.calls[0][0].Error;

        expect(resp.status).toHaveBeenCalledWith(400);
        expect(error).toMatch(/Password/);
    });

    it('should call next if both username and password fields are present', () => {
        req.body.username = 'testuser';
        req.body.password = 'testpassword';

        validateUser(req, resp, next);

        expect(next).toHaveBeenCalled();
    });

})