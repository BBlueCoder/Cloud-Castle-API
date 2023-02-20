class Controller {

    constructor(req, resp) {
        this.req = req;
        this.resp = resp;
    }

    async checkResult(obj, method, ...args) {
        const result = await obj[method](...args);
        this.sendSuccessResponse(result.rows);
    }

    sendSuccessResponse(data) {
        this.resp.status(200).json(data);
    }

    sendFailResponse(err) {
        this.resp.status(400).json({ error: "" + err });
    }
}

module.exports = Controller