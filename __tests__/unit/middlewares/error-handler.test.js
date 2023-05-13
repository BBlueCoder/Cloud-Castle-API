const errorHandler = require('../../../middlewares/error-handler');
const DuplicateUsername = require('../../../errors/duplicate-username');

describe('error-handler middleware',()=>{
    it('should return a status code and a message on json format on a custom error',()=>{
        const res = {
            status : jest.fn( () => res),
            json : jest.fn()
        }

        //chose any custom error for testing
        const error = new DuplicateUsername();
        errorHandler(error,{},res,() => {});

        const [ statusCode ] = res.status.mock.calls[0];
        expect(statusCode).toBeDefined();

        const [ responseJson ] = res.json.mock.calls[0];
        const { Message } = responseJson;
        expect(Message).toBeDefined();
    })

    it('should return 500 status code and a message on json format on a general error',()=>{
        const res = {
            status : jest.fn( () => res),
            json : jest.fn()
        }

        const error = new Error();
        errorHandler(error,{},res,() => {});

        expect(res.status).toHaveBeenCalledWith(500);

        const [ responseJson ] = res.json.mock.calls[0];
        const { Message } = responseJson;
        expect(Message).toMatch(/Something went wrong/);
    })
})