const request = require("supertest");
const pool = require("../../../db-pool");

describe("api/health", () => {
  let server;

  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
    await pool.end();
  });

  it("should return a success status with a message", async () => {
    const resp = await request(server).get("/api/health");

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty("server");
    expect(resp.body.database).toBe(true);
    expect(resp.body.cache).toBe(true);
  });
});
