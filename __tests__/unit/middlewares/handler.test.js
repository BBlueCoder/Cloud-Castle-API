const handler = require("../../../middlewares/handler");

describe("handler middleware", () => {
  const req = {};
  const resp = {};
  const next = jest.fn();

  it("should call next() and pass an error object", async () => {
    const error = new Error("test error");
    const fun = jest.fn(() => {
      throw error;
    });
    const next = jest.fn();

    await handler(fun)(req, resp, next);

    expect(fun).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call the handler function with req and resp", async () => {
    const fun = jest.fn();

    await handler(fun)(req, resp, next);

    expect(fun).toHaveBeenCalledWith(req, resp);
  });
});
