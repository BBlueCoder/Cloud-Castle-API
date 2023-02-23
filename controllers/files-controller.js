const filesDB = require('../db/files-crud');
const FileNotFound = require('../errors/file-not-found');
const Controller = require('./controller');
const EmptyBody = require('../errors/empty-files-body');
const { access  } = require('node:fs/promises');
const fs = require('fs');

const storagePath = './storage';

class FileController extends Controller {
    constructor(req, resp) {
        super(req, resp);
        this.userId = req.userId;
    }

    async getFiles() {
        await super.checkResult(filesDB, 'getFiles', this.userId);
    }

    async addFiles() {

        const addedFiles = [];

        if (!this.req.files)
            throw new EmptyBody("No files found, please make sure to name the field files");

        for (const file of this.req.files) {

            const fileObj = {
                originName: file.originalname,
                savedName: file.filename,
                fileType: file.mimetype,
                contentLength: file.size,
                dateInMillis: Date.now(),
                fileOwner: this.userId
            }

            const result = await filesDB.addFile(fileObj);
            if (result.rows.length > 0)
                addedFiles.push(result.rows[0]);
        }

        super.sendSuccessResponse(addedFiles);
    }

    async getFileData() {
        const result = await filesDB.getFile(this.userId, this.req.params.fileId);
        if (result.rows.length < 1)
            throw new FileNotFound();
        this.sendSuccessResponse(result.rows[0]);
    }

    async getFile() {
        const result = await filesDB.getFile(this.userId, this.req.params.fileId);
        if (result.rows.length < 1)
            throw new FileNotFound();

        const fileMetaData = result.rows[0];
        const filePath = `${storagePath}/${this.userId}/${fileMetaData.savedname}`;

        try{
            await access(filePath);
        }catch {
            throw new FileNotFound();
        }

        this.resp.set({
            "Content-Type": fileMetaData.filetype,
            "Content-Length": fileMetaData.contentlength
        });

        fs.createReadStream(filePath).pipe(this.resp);
    }

    async deleteFile() {
        const result = await filesDB.getFile(this.userId, this.req.params.fileId);
        if (result.rows.length < 1)
            throw new FileNotFound();
        super.checkResult(filesDB, 'removeFile', this.userId, this.req.params.fileId);
    }

    async deleteFiles() {
        if (!this.req.body[0])
            throw new EmptyBody("No files found, please make sure to send a json body that contains ids of files");

        for (const file of this.req.body) {
            if (file.id)
                await filesDB.removeFile(this.userId, file.id);
        }
        super.sendSuccessResponse({ "success": "Files had removed successfully" });
    }
}

module.exports = FileController;