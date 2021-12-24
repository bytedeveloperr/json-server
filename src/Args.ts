export class Args {
  private args: any = {}

  constructor() {
    this.parseDenoArgs()
  }

  private parseDenoArgs() {
    const args = Deno.args

    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      const [key, value] = arg.split("=")

      this.args[key.replaceAll("-", "")] = value
    }
  }

  public all() {
    return this.args
  }

  public get(key: string) {
    return this.args[key]
  }
}
