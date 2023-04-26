const express = require('express');
const FileController = require('../controllers/files-controller');
const handler = require('../middlewares/handler');
const auth = require('../middlewares/authentificate-user');
const upload = require('../middlewares/multer-upload');
const validateQueryParams = require('../middlewares/validate-get-pagging-req');

const route = express.Router();

route.get('/metadata/:fileId', auth, handler(async (req, resp) => {
    if (!req.params.fileId)
        return resp.status(400).send('File id is not provided');
    const fileController = new FileController(req, resp);
    await fileController.getFileData();
}))

route.get('/:fileId', handler(async (req, resp) => {
    console.log(req.headers);
    req.userId = 3;
    const fileController = new FileController(req, resp);
    await fileController.getFile();
}))

route.get('/', auth,validateQueryParams, handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.getFiles();
}))

route.get('/thumbnail/:fileId', auth, handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.getThumbnail();
}))

route.post('/', auth, upload, handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.addFiles();
}))

route.delete('/:fileId', auth, handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.deleteFile();
}))

route.delete('/', auth, handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.deleteFiles();
}))

module.exports = route;