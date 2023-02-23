const pool = require('../db-pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserNotFound = require('../errors/user-not-found');
const InvalidPassword = require('../errors/password-incorrect');
const DuplicateUsername = require('../errors/duplicate-username');
const config = require('config');

const _username = new WeakMap();
const _password = new WeakMap();

const _executeQuery = new WeakMap();

class User{
    constructor(username,password){
        _username.set(this,username);
        _password.set(this,password);

        _executeQuery.set(this,async (query)=>{
            const result = await pool.query(query);
            return result;
        })
    }

    async signup(){
        const checkUserQuery = `SELECT * FROM users where username = '${_username.get(this)}'`;
        const checkResult = await _executeQuery.get(this)(checkUserQuery);
        if(checkResult.rows.length>0)
            throw new DuplicateUsername();

        const hashed_password = await bcrypt.hash(_password.get(this),10);
        const query = `INSERT INTO users(username,password) values ('${_username.get(this)}','${hashed_password}') RETURNING *`;
            
        const result = await _executeQuery.get(this)(query);
        const user = result.rows[0];
        const token = this.generateJWT({id : user.id,username : user.username});
        return token;
    }

    async login(){
        const query = `SELECT * FROM users where username = '${_username.get(this)}'`;
        const result = await _executeQuery.get(this)(query);

        if(result.rows.length<1){
            throw new UserNotFound();
        }

        const user = result.rows[0];
        if(!(await bcrypt.compare(_password.get(this),user.password))){
            throw new InvalidPassword();
        }

        const token = this.generateJWT({id : user.id,username : user.username});
        return token;
    }

    generateJWT(payload){
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 35),
            data : payload
        },config.get('jwtPrivateKey'))
    }
}

module.exports = User;