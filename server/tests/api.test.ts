import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { app } from "../src/index.ts";

test("GET /api/health returns service status", async () => {
  const server = app.listen(0);
  await once(server, "listening");

  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(payload, { status: "ok" });
  } finally {
    server.close();
  }
});
