import { Readable } from "node:stream"

let serverPromise

function getServer() {
  if (!serverPromise) {
    serverPromise = import("../dist/server/server.js").then(
      (mod) => mod.default || mod
    )
  }
  return serverPromise
}

export default async function handler(req, res) {
  const server = await getServer()

  // 1. Web Standard fetch signature: handler(Request) -> Response
  if (
    req &&
    typeof req.text === "function" &&
    typeof req.arrayBuffer === "function"
  ) {
    return server.fetch(req)
  }

  // 2. Node.js signature: handler(IncomingMessage, ServerResponse)
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https"
    const host =
      req.headers["x-forwarded-host"] || req.headers.host || "localhost"
    const url = new URL(req.url, `${protocol}://${host}`)

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v)
        } else {
          headers.set(key, value)
        }
      }
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD"
    const body = hasBody ? req : undefined

    const webRequest = new Request(url, {
      method: req.method,
      headers,
      body,
      // @ts-ignore
      duplex: "half",
    })

    const webResponse = await server.fetch(webRequest)

    res.statusCode = webResponse.status
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val)
    })

    if (webResponse.body) {
      Readable.fromWeb(webResponse.body).pipe(res)
    } else {
      res.end()
    }
  } catch (error) {
    console.error("[Vercel Serverless Error]", error)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader("Content-Type", "text/plain")
      res.end("Internal Server Error")
    }
  }
}
