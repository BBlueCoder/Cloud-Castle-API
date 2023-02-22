const multer = require('multer');
const path = require('path');
const { access, mkdir  } = require('node:fs/promises');

const storagePath = './storage';

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const path = `${storagePath}/${req.userId}`;
        try{
            await access(path);
        }catch{ 
            await mkdir(path, { recursive: true });
        }
        cb(null,path);
    },
    filename: (req, file, cb) => {
        const fileMetadata = path.parse(file.originalname);
        const newFileName = `${Date.now()}_${fileMetadata.name}${fileMetadata.ext}`;
        cb(null, newFileName);
    }
})

module.exports = multer({ storage: storage }).array('files', 300);