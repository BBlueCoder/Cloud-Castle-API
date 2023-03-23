const pool = require('../db-pool');

async function executeQuery(query) {
    const result = await pool.query(query);
    return result;
}

function filterQuery(query,filetype){
    if (filetype === 'other') {
        query += `AND filetype NOT LIKE '%image%'
            AND filetype NOT LIKE '%video%' 
            AND filetype NOT LIKE '%audio%'`;
    } else {
        query += `AND filetype like '%${filetype}%'`;
    }
    return query;
}

exports.getFiles = (userId, filetype = '') => {
    let query = `SELECT * 
        FROM files 
        WHERE fileowner = ${userId} `;
    query = `${filterQuery(query,filetype)} ORDER BY dateinmillis desc`;
    return executeQuery(query);
}

exports.getFilesWithPaging = (userId, limit, offset, sort_order, filetype = '') => {
    let query = `SELECT *
        FROM files 
        WHERE fileowner = ${userId} `;
    query = `${filterQuery(query,filetype)} 
        ORDER BY dateinmillis ${sort_order}
        LIMIT ${limit}
        OFFSET ${offset}`;
    return executeQuery(query);
}

exports.addFile = (file) => {
    let query = `INSERT INTO 
    files(originname,savedname,filetype,contentlength,dateinmillis,duration,fileowner)`;
    query = `${query} values 
    ('${file.originName}','${file.savedName}','${file.fileType}',
    ${file.contentLength},${file.dateInMillis},${file.duration},${file.fileOwner})`;
    query = `${query} RETURNING *`;
    return executeQuery(query);
}

exports.getFile = (userId, fileId) => {
    const query = `SELECT * 
    FROM files 
    where id = ${fileId} and fileowner = ${userId}`;
    return executeQuery(query);
}

exports.removeFile = (userId, fileId) => {
    const query = `DELETE 
    FROM files 
    where id = ${fileId} and fileowner = ${userId}`;
    return executeQuery(query);
}