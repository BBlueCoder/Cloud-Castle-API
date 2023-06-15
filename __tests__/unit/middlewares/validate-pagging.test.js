const validatePaggingParams = require('../../../middlewares/validate-get-pagging-req');
const InvalidQueryParameters = require('../../../errors/invalid-query-parameters');

describe('validate pagging params middleware', () => {
    let req, resp, next;

    beforeEach(() => {
        req = {
            query: {},
        };
        resp = {};
        next = jest.fn();
    });

    it('should throw InvalidQueryParameters error if limit is not a number', () => {
        req.query.limit = 'invalid';
        req.query.offset = '0';

        expect(() => validatePaggingParams(req, resp, next)).toThrow();
    });

    it('should throw InvalidQueryParameters error if offset is not a number', () => {
        req.query.offset = 'invalid';
        req.query.limit = '0';

        expect(() => validatePaggingParams(req, resp, next)).toThrow(
            InvalidQueryParameters
        );
    });

    it('should throw InvalidQueryParameters error if sort_order is not "asc" or "desc"', () => {
        req.query.limit = '10';
        req.query.offset = '0';
        req.query.sort_order = 'invalid';

        expect(() => validatePaggingParams(req, resp, next)).toThrow(
            InvalidQueryParameters
        );
    });

    it('should set sort_order to "desc" if not provided', () => {
        req.query.limit = '10';
        req.query.offset = '0';

        validatePaggingParams(req, resp, next);

        expect(req.query.sort_order).toBe('desc');
    });

    it('should call next when limit and offset are not provided', () => {
        validatePaggingParams(req, resp, next);

        expect(next).toHaveBeenCalled();
    });

    it('should call next when limit,offset and sort_order are provided', () => {
        req.query.limit = '10';
        req.query.offset = '0';
        req.query.sort_order = 'asc';

        validatePaggingParams(req, resp, next);

        expect(next).toHaveBeenCalled();
    });
});
