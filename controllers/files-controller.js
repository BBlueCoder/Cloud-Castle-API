const filesDB = require('../db/files-crud');
const FileNotFound = require('../errors/file-not-found');
const Controller = require('./controller');
const EmptyBody = require('../errors/empty-files-body');
const NoThumbnail = require('../errors/no-thumbnail');
const { access, stat } = require('node:fs/promises');
const fs = require('fs');
const generateThumbnail = require('../utils/video-thumbnail-generator');
const getDuration = require('../utils/audio-video-duration');
const { off } = require('node:process');
const config = require('config');

const _getFileFromDB = new WeakMap();
const _getStaticFilePath = new WeakMap();

class FileController extends Controller {
    constructor(req, resp) {
        super(req, resp);
        this.userId = req.userId;

        _getFileFromDB.set(this, async (userId, fileId) => {
            const result = await filesDB.getFile(userId, fileId);
            if (result.rows.length < 1){
                throw new FileNotFound();
            }
            return result;
        })

        _getStaticFilePath.set(this, async (userId, savedname) => {
            const storagePath = config.get("storagePath");
            const filePath = `${storagePath}/${userId}/${savedname}`;
            
            try {
                await access(filePath);
            } catch {
                throw new FileNotFound();
            }

            return filePath;
        })
    }

    async getFiles() {
        const { limit, offset, sort_order,file_type } = this.req.query;
        if (limit && offset) {
            await super.checkResult(filesDB, 'getFilesWithPaging', this.userId, limit, 
            offset, sort_order,typeof file_type === 'undefined' ? '' : file_type);
        } else
            await super.checkResult(filesDB, 'getFiles', this.userId,
            typeof file_type === 'undefined' ? '' : file_type);
    }

    async addFiles() {

        const addedFiles = [];

        if (!this.req.files)
            throw new EmptyBody("No files found, please make sure to send files with naming the field 'files'");

        for (const file of this.req.files) {

            let duration = 0;
            
            if (file.mimetype.includes('video') || file.mimetype.includes('audio')) {
                try {
                    duration = await getDuration(file.path);
                } catch { 
                    duration = null;
                }
            } else {
                duration = null;
            }

            const fileObj = {
                originName: file.originalname,
                savedName: file.filename,
                fileType: file.mimetype,
                contentLength: file.size,
                dateInMillis: Date.now(),
                duration: duration,
                fileOwner: this.userId
            }

            const result = await filesDB.addFile(fileObj);
            if (result.rows.length > 0)
                addedFiles.push(result.rows[0]);
        }

        super.sendSuccessResponse(addedFiles);
    }

    async getFileData() {
        const result = await _getFileFromDB.get(this)(this.userId, this.req.params.fileId);
        this.sendSuccessResponse(result.rows[0]);
    }

    async getFile() {
        const result = await _getFileFromDB.get(this)(this.userId, this.req.params.fileId);

        const fileMetaData = result.rows[0];
        const filePath = await _getStaticFilePath.get(this)(this.userId, fileMetaData.savedname);

        this.resp.set({
            "Content-Type": fileMetaData.filetype,
            "Content-Length": fileMetaData.contentlength
        });

        fs.createReadStream(filePath).pipe(this.resp);
    }

    async getThumbnail() {
        const result = await _getFileFromDB.get(this)(this.userId, this.req.params.fileId);
        const fileMetaData = result.rows[0];

        if (!fileMetaData.filetype.includes("image") && !fileMetaData.filetype.includes("video"))
            throw new NoThumbnail("File doesn't have a thumbnail");

        if (fileMetaData.filetype.includes("image")) {
            const filePath = await _getStaticFilePath.get(this)(this.userId, fileMetaData.savedname);

            this.resp.set({
                "Content-Type": fileMetaData.filetype,
                "Content-Length": fileMetaData.contentlength
            });

            fs.createReadStream(filePath).pipe(this.resp);
            return;
        }

        const thumbnail = await generateThumbnail(this.userId, fileMetaData.savedname);
        const stats = await stat(thumbnail);

        this.resp.set({
            "Content-Type": "image/jpeg",
            "Content-Length": stats.size
        });

        fs.createReadStream(thumbnail).pipe(this.resp);
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