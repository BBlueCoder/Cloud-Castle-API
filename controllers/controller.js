const redisAPI = require("../utils/redis-api");

class Controller {
  constructor(req, resp) {
    this.req = req;
    this.resp = resp;
  }

  async checkResult(obj, method, ...args) {
    let result = { rows: [] };

    if (method === "getFiles") {
      const key = `files-${args[0]}-${args[1]}-${args[2]}`;
      await this.getFilesFromCacheORDB(result, obj, method, key, args);
    } else if (method === "getFilesWithPaging") {
      const key = `files-paging-${args[0]}-${args[3]}-${args[1]}-${args[2]}-${args[4]}`;
      await this.getFilesFromCacheORDB(result, obj, method, key, args);
    } else {
      result = await obj[method](...args);
    }
    this.sendSuccessResponse(result.rows);
  }

  sendSuccessResponse(data) {
    this.resp.status(200).json(data);
  }

  sendFailResponse(err) {
    this.resp.status(400).json({ error: "" + err });
  }

  async getFilesFromCacheORDB(result, obj, method, key, args) {
    const resultFromCache = await redisAPI.get(key);

    if (!resultFromCache) {
      //fetch files from DB
      const respFromDB = await obj[method](...args);
      result.rows = respFromDB.rows;
      if (result.rows.length > 0) {
        await redisAPI.add(key, result.rows, 60 * 5);
      }
    } else {
      //check if there are files that have been removed but still in cache
      let removedFiles = [];
      const cacheRemovedFiles = await redisAPI.get(`files-removed-${args[0]}`);
      if (cacheRemovedFiles)
        removedFiles = removedFiles.concat(cacheRemovedFiles);

      result.rows = resultFromCache.filter(
        (file) => !removedFiles.includes(file.id)
      );
    }
  }
}

module.exports = Controller;
