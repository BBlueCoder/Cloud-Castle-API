const filesDB = require('../db/files_crud');
const Controller = require('./controller');

class FileController extends Controller{
    constructor(req,resp){
        super(req,resp);
    }

    getFiles(){
        super.checkResult(filesDB,'getFiles',1);
    }

    async addFiles(){
        try{
            const addedFiles = [];

            for(const file of this.req.files){
                
                const fileObj = {
                    originName:file.originalname,
                    savedName:file.filename,
                    fileType:file.mimetype,
                    contentLength:file.size,
                    dateInMillis:Date.now(),
                    fileOwner : 1
                }

                const result = await filesDB.addFile(fileObj);
                if(result.rows.length > 0 )
                    addedFiles.push(result.rows[0]);
            }
            
            super.sendSuccessResponse(addedFiles);
        }catch(err){
            console.log(err);
            super.sendFailResponse(err);
        }
        
    }

    getFile(){
        super.checkResult(filesDB,'getFile',1,this.req.params.fileId);
    }

    deleteFile(){
        super.checkResult(filesDB,'removeFile',1,this.req.params.fileId);
    }

    async deleteFiles(){
        try{   
            for(const file of this.req.body){
                await filesDB.removeFile(1,file.id);
            }
            super.sendSuccessResponse({"success":"Files had removed successfully"});
        }catch(err){
            super.sendFailResponse(err);
        }
    }
}

module.exports = FileController;