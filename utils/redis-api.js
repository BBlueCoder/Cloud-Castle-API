const { createClient } = require('redis');

async function handler(invoke) {
    try {
        const client = createClient();
        await client.connect(client);
        const result = await invoke(client);
        await client.disconnect();
        return result;
    } catch {
        return
    }
}

async function add(key, value, expiresInSeconds = null) {
    return await handler(async (client) => {
        const reply = await client.set(key, JSON.stringify(value));
        if (expiresInSeconds) {
            await client.expire(key, expiresInSeconds);
        }

        return reply;
    })
}

async function get(key) {
    return await handler(async (client) => {
        const data = await client.get(key);
        if (data)
            return JSON.parse(data);
        return null;
    })
}

async function remove(key) {
    return await handler(async (client) => {
        const isRemoved = await client.del(key);
        return isRemoved;
    })
}

async function clearAll() {
    return await handler(async (client) => {
        const isDataCleared = await client.flushDb();
        return isDataCleared;
    })
}

module.exports = { add, get, remove, clearAll };