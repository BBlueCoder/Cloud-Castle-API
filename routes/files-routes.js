const express = require('express');
const FileController = require('../controllers/files-controller');
const handler = require('../middlewares/handler');

const route = express.Router();

const multer = require('multer');
const path = require('path');
const winston = require('winston');

const storagePath = './storage';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, storagePath);
    },
    filename: (req, file, cb) => {
        const fileMetadata = path.parse(file.originalname);
        const newFileName = `${Date.now()}_${fileMetadata.name}${fileMetadata.ext}`;
        cb(null, newFileName);
    }
})

const upload = multer({ storage: storage }).array('files', 100);

route.get('/metadata/:fileId', handler(async (req, resp) => {
    if (!req.params.fileId)
        return resp.status(400).send('File id is not provided');
    const fileController = new FileController(req, resp);
    await fileController.getFileData();
}))

route.get('/:fileId', handler(async (res, resp) => {
    const fileController = new FileController(res,resp);
    await fileController.getFile();
}))

route.get('/', handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.getFiles();
}))

route.post('/',upload, handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.addFiles();
}))

route.delete('/:fileId', handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.deleteFile();
}))

route.delete('/', handler(async (req, resp) => {
    const fileController = new FileController(req, resp);
    await fileController.deleteFiles();
}))

module.exports = route;