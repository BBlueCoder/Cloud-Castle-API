const multer = require('multer');
const path = require('path');
const config = require('config');
const { access, mkdir } = require('node:fs/promises');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {

        const storagePath = config.get("storagePath");

        const path = `${storagePath}/${req.userId}`;
        try {
            await access(path);
        } catch {
            await mkdir(path, { recursive: true });
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const fileMetadata = path.parse(file.originalname);
        const newFileName = `${Date.now()}_${fileMetadata.name}${fileMetadata.ext}`;
        cb(null, newFileName);
    }
})

module.exports = multer({ storage: storage }).array('files', 300);