import { Args } from "./src/Args.ts"
import { Server } from "./src/Server.ts"

const args = new Args()
const port = args.get("port")

if (!port || (port && !isNaN(Number(port)))) {
  new Server()
} else if (port && isNaN(Number(port))) {
  throw new Error(`Invalid port ${port}`)
}
