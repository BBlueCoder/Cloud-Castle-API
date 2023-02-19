const express = require('express');
const route = express.Router();

const multer = require('multer');
const FileController = require('../controllers/files_controller');
const path = require('path');

// const app = express();
// app.use(bodyParser.json());

const storagePath = './storage';

const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,storagePath);
    },
    filename : (req,file,cb)=>{
        const fileMetadata = path.parse(file.originalname);
        const newFileName = `${Date.now()}_${fileMetadata.name}${fileMetadata.ext}`;
        cb(null,newFileName);
    }
})

const upload = multer({storage:storage}).array('files',100);

route.get('/:fileId',(req,resp)=>{
    if(!req.params.fileId)
        return resp.status(400).send('File id is not provided');
    const fileController = new FileController(req,resp);
        fileController.getFile();
})

route.get('/',(req,resp)=>{
    const fileController = new FileController(req,resp);
    fileController.getFiles();
})

route.post('/',(req,resp)=>{
    upload(req,resp,err=>{
        if(err){
            console.log(err);
            resp.status(400).send('error');
            return
        }
        const fileController = new FileController(req,resp);
        fileController.addFiles();
    })
})

route.delete('/:fileId',(req,resp)=>{
    const fileController = new FileController(req,resp);
    fileController.deleteFile();
})

route.delete('/',(req,resp)=>{
    const fileController = new FileController(req,resp);
    fileController.deleteFiles();
})

module.exports = route;