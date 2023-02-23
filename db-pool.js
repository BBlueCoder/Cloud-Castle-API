const Pool = require('pg').Pool
const config = require('config');

const pool = new Pool({
    user: config.get('dbConfig.dbUser'),
    host : 'localhost',
    database : config.get('dbConfig.dbName'),
    password : config.get('dbConfig.dbPassword'),
    port : 5432,
})

module.exports = pool;

/* exports.getUsers = (req,resp)=>{
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM users',(error,results)=>{
            if(error){
                console.log(error);
                reject(error);
                return
            }

            resolve(results);
        })
    })
} */