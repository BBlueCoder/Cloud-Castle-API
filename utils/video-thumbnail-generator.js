const {exec} = require('child_process');
const { access,mkdir } = require('node:fs/promises');
const _path = require('path');

const generateThumbnail = async (userId,videoName)=>{
    const dirPath = await getThumbnailDir(userId);

    const metadata = _path.parse(videoName);

    const thumbnailPath = `${dirPath}\\${metadata.name}_thumbnail.jpg`;
    if(await isThumbnailExist(thumbnailPath))
        return thumbnailPath;

    const filePath = `${getRoot()}\\storage\\${userId}\\${videoName}`;

    const command = `ffmpeg -hide_banner -i ${filePath} -ss 00:00:01 -vframes 1 ${thumbnailPath}`;

    await executeCommand(command);

    return thumbnailPath
}

function getRoot(){
    const workingDir = process.cwd();
    return workingDir.replace("utils","");
}

async function getThumbnailDir(userId){
    const path = `${getRoot()}\\storage\\${userId}\\thumbnails`

    try{
        await access(path);
        return path;
    }catch{
        return await mkdir(path, { recursive: true });
    }
}

async function isThumbnailExist(path){
    try{
        await access(path);
        return true;
    }catch{
        return false;
    }
}

function executeCommand(command){
    return new Promise((resolve,reject)=>{
        exec(command,(error,stdout,stderr)=>{
            if(error){
                console.log(error);
                reject(new Error(error.message));
                return;
            }
            console.log(`stdout :${stdout}`);
            console.log(`stderr :${stderr}`);
            if(stderr){
                resolve(stderr);
            }
        })
    })
}

module.exports = generateThumbnail;