import { walk } from "https://deno.land/std@0.119.0/fs/mod.ts"

export class JsonRouter {
  protected base: string
  protected routes: any[]

  public constructor() {
    this.base = Deno.cwd()
    this.routes = []
  }

  async loadFiles() {
    for await (const entry of walk(this.base)) {
      if (entry.isFile && !entry.isSymlink && entry.name.endsWith("json")) {
        const filePath = entry.path
        const routePath = filePath.substring(this.base.length)

        this.routes.push({ filePath, routePath })
      }
    }
  }

  public get paths() {
    return this.routes
  }

  public getFileRoute(url: string): any {
    let newUrl = new URL(url)
    let pathname = newUrl.pathname.replace(/\/+$/, "")

    if (!pathname.endsWith(".json")) {
      pathname += ".json"
    }

    return this.routes.find((p) => {
      const path = `${p.routePath.substring(0, p.routePath.length - 5)}/:id`

      if (p.routePath === pathname || new URLPattern({ pathname: path }).test(new URL(pathname, newUrl.origin))) {
        const urlPattern = new URLPattern({ pathname: path }).exec(new URL(pathname, newUrl.origin))
        if (urlPattern != null) {
          let id = urlPattern.pathname?.groups?.id
          if (id.endsWith(".json")) {
            id = id.substring(0, id.length - 5)
          }

          p.params = {
            id,
          }
        }

        return true
      }
      return false
    })
  }
}
