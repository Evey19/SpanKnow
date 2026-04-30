import http from "node:http";
import { URL } from "node:url";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve(undefined);
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function writeJson(res, status, payload) {
  const json = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Length": Buffer.byteLength(json),
  });
  res.end(json);
}

function writeEmpty(res, status) {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end();
}

function isValidMessage(message) {
  return (
    message &&
    typeof message === "object" &&
    typeof message.role === "string" &&
    typeof message.content === "string"
  );
}

async function callOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return undefined;

  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${text.slice(0, 200)}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}

async function generateReply(messages) {
  const replyFromLLM = await callOpenAI(messages);
  if (typeof replyFromLLM === "string") return replyFromLLM;

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser?.content) return `（未配置 OPENAI_API_KEY）你刚才说：${lastUser.content}`;
  return "（未配置 OPENAI_API_KEY）";
}

export function createApiServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "OPTIONS") {
      writeEmpty(res, 204);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/v1/assistant/chat") {
      try {
        const body = await readJsonBody(req);
        const messages = body?.messages;
        const ragEnabled = Boolean(body?.rag_enabled);
        const topK = Number.isFinite(body?.top_k) ? Number(body.top_k) : 5;

        if (!Array.isArray(messages) || !messages.every(isValidMessage)) {
          writeJson(res, 400, { message: "Invalid request: messages[]" });
          return;
        }

        if (ragEnabled && (!Number.isInteger(topK) || topK <= 0)) {
          writeJson(res, 400, { message: "Invalid request: top_k" });
          return;
        }

        const reply = await generateReply(messages);

        writeJson(res, 200, {
          reply,
          chunks: [],
        });
      } catch (err) {
        writeJson(res, 500, { message: err instanceof Error ? err.message : "Internal error" });
      }
      return;
    }

    writeJson(res, 404, { message: "Not found" });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 8080);
  const server = createApiServer();
  server.listen(port, "0.0.0.0", () => {
    process.stdout.write(`API server listening on http://127.0.0.1:${port}\n`);
  });
}

