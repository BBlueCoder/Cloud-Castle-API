const express = require('express');
const pool = require('../db-pool');
const redisAPI = require('../utils/redis-api');
const getHostIPv4 = require('../utils/get-host-ip');


const route = express.Router();

route.get('/',async (req,resp)=>{
    const status = {
        server : "",
        database : false,
        cache : false
    };

    try{
        const client = await pool.connect();
        status.database = true;
        client.release();
    }catch{}

    try{
        const isRedisReady = await redisAPI.checkConnection();
        status.cache = isRedisReady;
    }catch{}

    const ip = getHostIPv4();
    
    if(ip)
        status.server = ip;

    resp.status(200).json(status);
})

module.exports = route;