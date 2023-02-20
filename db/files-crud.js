const pool = require('../db-pool');

async function executeQuery(query) {
    const result = await pool.query(query);
    return result;
}

exports.getFiles = (userId) => {
    let query = `SELECT * FROM files WHERE fileowner = ${userId}`;
    return executeQuery(query);
}

exports.addFile = (file) => {
    let query = `INSERT INTO files(originname,savedname,filetype,contentlength,dateinmillis,fileowner)`;
    query = `${query} values ('${file.originName}','${file.savedName}','${file.fileType}',${file.contentLength},${file.dateInMillis},${file.fileOwner})`;
    query = `${query} RETURNING *`;
    return executeQuery(query);
}

exports.getFile = (userId, fileId) => {
    const query = `SELECT * FROM files where id = ${fileId} and fileowner = ${userId}`;
    return executeQuery(query);
}

exports.removeFile = (userId, fileId) => {
    const query = `DELETE FROM files where id = ${fileId} and fileowner = ${userId}`;
    return executeQuery(query);
}