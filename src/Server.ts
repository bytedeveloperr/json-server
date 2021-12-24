import { JsonRouter } from "./JsonRouter.ts"
import { RouteHandler } from "./RouteHandler.ts"

export class Server {
  protected listener?: Deno.Listener
  protected port: number
  protected jsonRouter: JsonRouter
  protected routeHandler: RouteHandler

  public constructor(port?: number) {
    this.jsonRouter = new JsonRouter()
    this.routeHandler = new RouteHandler()
    this.port = port || 8080

    try {
      this.listener = this.listen(this.port)
    } catch (e) {
      if (e.code === "EADDRINUSE") {
        const port = Math.round(Math.random() * Math.pow(10, 4))
        return new Server(port)
      }
      throw e
    }

    this.jsonRouter.loadFiles()
    this.serveHttp()
    console.log(`Serving JSON files from ${Deno.cwd()} on port ${this.port}`)
  }

  protected async serveHttp() {
    for await (const conn of this.listener!) {
      this.handleHttp(Deno.serveHttp(conn))
    }
  }

  protected async handleHttp(httpConn: Deno.HttpConn) {
    for await (const requestEvent of httpConn) {
      try {
        const route = this.jsonRouter.getFileRoute(requestEvent.request.url)
        if (!route) {
          throw new Error(`This route does not exist`)
        }

        let body
        if (requestEvent.request.body) {
          const contentType = requestEvent.request.headers.get("content-type")
          switch (contentType) {
            case "application/x-www-form-urlencoded":
              body = await requestEvent.request.formData()
              const o: any = {}

              body.forEach((v, k) => {
                o[k] = v
              })

              body = o
              break
            case "application/json":
              body = await requestEvent.request.json()
              break
          }
        }

        const response = await this.routeHandler.handle({ route, method: requestEvent.request.method, body })
        requestEvent.respondWith(
          new Response(response || "", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        )
      } catch (err) {
        requestEvent.respondWith(
          new Response(
            JSON.stringify({
              message: err.message,
              cause: err.cause,
              name: err.name,
              stack: err.stack,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
        )
      }
    }
  }

  protected listen(port: number) {
    return Deno.listen({ port })
  }
}
