const Pool = require('pg').Pool

const pool = new Pool({
    user: 'nodeserver',
    host : 'localhost',
    database : 'home_cloud',
    password : '031900',
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