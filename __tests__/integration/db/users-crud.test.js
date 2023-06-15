jest.mock("../../../utils/redis-api");
jest.mock("bcrypt");

const User = require("../../../db/users-crud");
const redisAPI = require("../../../utils/redis-api");
const pool = require("../../../db-pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("users crud test cache", () => {
  const testUser = new User("testuser", "testpassword");
  let mockUser;

  beforeAll(async () => {
    bcrypt.hash.mockImplementation(async (password, salt) => {
      return password;
    });

    bcrypt.compare.mockImplementation(async (data, encrypted) => {
      return true;
    });

    const token = await testUser.signup();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    mockUser = {
      id: decoded.data.id,
      username: testUser.username,
      password: testUser.password,
    };
  });

  beforeEach(() => {
    redisAPI.get.mockClear();
    redisAPI.add.mockClear();
  });

  afterAll(async () => {
    await testUser.deleteUser();
    await redisAPI.clearAll();
    await pool.end();
  });

  it("should fetch the user from db and add cache it", async () => {
    redisAPI.get.mockImplementation(
      async (key, value, expiresInSeconds = null) => {
        return null;
      }
    );

    redisAPI.add.mockImplementation(async (key) => {
      return "OK";
    });

    await testUser.login();

    expect(redisAPI.get).toHaveBeenCalled();
    expect(redisAPI.get).toHaveBeenCalledWith(`users-${testUser.username}`);
    expect(redisAPI.add).toHaveBeenCalled();
    expect(redisAPI.add).toHaveBeenCalledWith(
      `users-${testUser.username}`,
      mockUser,
      3600
    );
  });

  it("should fetch the user from cache not db", async () => {
    redisAPI.get.mockImplementation(
      async (key, value, expiresInSeconds = null) => {
        return mockUser;
      }
    );

    redisAPI.add.mockImplementation(async (key) => {
      console.log("redis add called");
      return "OK";
    });

    await testUser.login();

    expect(redisAPI.get).toHaveBeenCalled();
    expect(redisAPI.add).not.toHaveBeenCalled();
  });

  it("should remove the user from cache", async () => {
    redisAPI.remove.mockImplementation(async (key) => {
      return true;
    });

    await testUser.deleteUser();

    expect(redisAPI.remove).toHaveBeenCalled();
  });
});
