import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = await realpath(fileURLToPath(new URL("./docs", import.meta.url)));
const port = Number(process.env.FUSSETTI_PORT || 4173);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2"
};

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  try {
    const { pathname } = new URL(request.url, "http://127.0.0.1");
    let file = resolve(root, "." + decodeURIComponent(pathname));
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }

    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    file = await realpath(file);
    if (!file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }

    const info = await stat(file);
    if (!info.isFile()) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    if (request.method === "HEAD") {
      response.end();
    } else {
      createReadStream(file).on("error", () => response.destroy()).pipe(response);
    }
  } catch {
    response.writeHead(404).end("Página no encontrada");
  }
});

server.on("error", error => {
  console.error(`No se pudo iniciar Fussetti en el puerto ${port}. ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Fussetti en escena · http://127.0.0.1:${port}/`);
});

