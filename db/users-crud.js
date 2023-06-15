const pool = require('../db-pool');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const redisAPI = require('../utils/redis-api');
const Joi = require('joi');

const UserNotFound = require('../errors/user-not-found');
const InvalidPassword = require('../errors/password-incorrect');
const DuplicateUsername = require('../errors/duplicate-username');
const CustomError = require('../errors/custom-error-class');

const _username = new WeakMap();
const _password = new WeakMap();

const _executeQuery = new WeakMap();

class User {
    constructor(username, password) {
        _username.set(this, username);
        _password.set(this, password);

        _executeQuery.set(this, async (query) => {
            const client = await pool.connect();
            const result = await client.query(query);
            client.release();
            return result;
        });
    }

    get username() {
        return _username.get(this);
    }

    get password() {
        return _password.get(this);
    }

    validateUser() {
        const userSchema = Joi.object({
            username: Joi.string().alphanum().min(5).max(30).required(),

            password: Joi.string()
                .pattern(new RegExp('^(?=.*[A-Z])(?=.*[@._-])[A-Za-z0-9@._-]+$'))
                .min(8)
                .max(50)
                .required(),
        });

        const { error } = userSchema.validate({
            username: _username.get(this),
            password: _password.get(this),
        });
        if (error) throw new CustomError(error, 400);

        return true;
    }

    async signup() {
        const checkUserQuery = `SELECT * FROM users where username = '${_username.get(
            this
        )}'`;
        const checkResult = await _executeQuery.get(this)(checkUserQuery);
        if (checkResult.rows.length > 0) throw new DuplicateUsername();

        const hashed_password = await bcrypt.hash(_password.get(this), 10);
        const query = `INSERT INTO users(username,password) values ('${_username.get(
            this
        )}','${hashed_password}') RETURNING *`;

        const result = await _executeQuery.get(this)(query);
        const user = result.rows[0];
        const token = this.generateJWT({ id: user.id, username: user.username });
        return token;
    }

    async login() {
        let user = await redisAPI.get(`users-${_username.get(this)}`);
        if (!user) {
            const query = `SELECT * FROM users where username = '${_username.get(
                this
            )}'`;

            const result = await _executeQuery.get(this)(query);

            if (result.rows.length < 1) {
                throw new UserNotFound();
            }
            user = result.rows[0];
            await redisAPI.add(`users-${user.username}`, user, 3600);
        }

        if (!(await bcrypt.compare(_password.get(this), user.password))) {
            throw new InvalidPassword();
        }

        const token = this.generateJWT({ id: user.id, username: user.username });
        return token;
    }

    async deleteUser() {
        await redisAPI.remove(`users-${_username.get(this)}`);
        const query = `DELETE FROM users where username = '${_username.get(this)}'`;
        await _executeQuery.get(this)(query);
    }

    generateJWT(payload) {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 35,
                data: payload,
            },
            config.get('jwtPrivateKey')
        );
    }
}

module.exports = User;
