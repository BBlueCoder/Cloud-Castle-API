const redisAPI = require("../../../utils/redis-api");

describe("redis api", () => {
  let key;
  let value;

  const delay = (milliseconds) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  beforeEach(async () => {
    key = "users-testuser";
    value = {
      id: 3,
      username: "testuser",
    };
    await redisAPI.add(key, value);
  });

  afterEach(async () => {
    await redisAPI.remove(key);
  });

  it("should return null when the data is not available", async () => {
    key = "invalid";
    const user = await redisAPI.get(key);
    expect(user).toBeNull();
  });

  it("should saves the data and return OK", async () => {
    const reply = await redisAPI.add(key, value);
    expect(reply).toEqual("OK");
  });

  it("should removed after expire time reached", async () => {
    await redisAPI.remove(key);
    const reply = await redisAPI.add(key, value, 1);

    await delay(1000);
    const user = await redisAPI.get(key);

    expect(reply).toEqual("OK");
    expect(user).toBeNull();
  });

  it("should return the data", async () => {
    const resp = await redisAPI.get(key);
    expect(resp).toEqual(value);
  });

  it("should return 0 if the data is not available and try to remove it", async () => {
    key = "invalid";
    const isRemoved = await redisAPI.remove(key);
    expect(isRemoved).toBe(0);
  });

  it("should return 1 when removes existing data", async () => {
    const isRemoved = await redisAPI.remove(key);
    expect(isRemoved).toBe(1);
  });

  it("should return clear all data", async () => {
    const isDataCleared = await redisAPI.clearAll();
    const user = await redisAPI.get(key);
    expect(isDataCleared).toBe("OK");
    expect(user).toBeNull();
  });
});
