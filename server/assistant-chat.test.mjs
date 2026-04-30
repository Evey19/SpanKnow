import test from "node:test";
import assert from "node:assert/strict";
import { createApiServer } from "./index.mjs";

test("POST /api/v1/assistant/chat returns reply/chunks", async () => {
  const server = createApiServer();
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const port = server.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/assistant/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "system", content: "你是一个助手" }, { role: "user", content: "你好" }],
        rag_enabled: false,
        top_k: 5,
      }),
    });

    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(typeof payload.reply, "string");
    assert.ok(Array.isArray(payload.chunks));
  } finally {
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve())),
    );
  }
});

