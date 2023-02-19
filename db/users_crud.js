const pool = require('../db_pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const _username = new WeakMap();
const _password = new WeakMap();

const _executeQuery = new WeakMap();

class User{
    constructor(username,password){
        _username.set(this,username);
        _password.set(this,password);

        _executeQuery.set(this,(query)=>{
            return new Promise(async (resolve,reject)=>{
                try{
                    const result = await pool.query(query);
                    resolve(result);
                }catch(err){
                    console.log(err);
                    reject(err);
                }
            })
        })
    }

    signup(){
        return new Promise(async (resolve,reject)=>{
            const hashed_password = await bcrypt.hash(_password.get(this),10);
            const query = `INSERT INTO users(username,password) values ('${_username.get(this)}','${hashed_password}') RETURNING *`;

            const result = await _executeQuery.get(this)(query);
            const user = result.rows[0];
            const token = this.generateJWT({id : user.id,username : user.username});
            resolve(token);
        })
    }

    login(){
        return new Promise(async (resolve,reject)=>{
            try{
                const query = `SELECT * FROM users where username = '${_username.get(this)}'`;
                const resultFromQuery = await _executeQuery.get(this)(query);

                if(resultFromQuery.rows.length<1){
                    reject(new Error('User not found'));
                    return;
                }

                const user = resultFromQuery.rows[0];
                if(!bcrypt.compare(_password.get(this),user.password)){
                    reject(new Error('Password is incorrect'));
                    return;
                }

                const token = this.generateJWT({id : user.id,username : user.username});
                resolve(token);
            }catch(err){
                reject(err)
            }
            
        })
    }

    generateJWT(payload){
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 35),
            data : payload
        },"privateKey")
    }


}

module.exports = User;