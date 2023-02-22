const express = require('express');
const FileController = require('../controllers/files-controller');
const handler = require('../middlewares/handler');
const auth = require('../middlewares/authentificate-user');
const upload = require('../middlewares/multer-upload');

const route = express.Router();

route.get('/metadata/:fileId', auth, handler(async (req, resp) => {
    if (!req.params.fileId)
        return resp.status(400).send('File id is not provided');
    const fileController = new FileController(req, resp);
    await fileController.getFileData();
}))

route.get('/:fileId', auth, handler(async (res, resp) => {
    const fileController = new FileController(res, resp);
    await fileController.getFile();
}))

route.get('/', auth, handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.getFiles();
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