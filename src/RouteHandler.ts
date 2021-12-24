export class RouteHandler {
  public async handle({ route, method, body }: { route: any; method: string; body?: any }) {
    switch (method) {
      case "GET":
        return await this.get(route)
      case "POST":
        return await this.post(route, body)
      case "PUT":
        return await this.put(route, body)
      case "DELETE":
        return await this.delete(route)
    }
  }

  private async get(route: any) {
    const data = await Deno.readTextFile(route.filePath)
    if (route.params?.id) {
      const item = JSON.parse(data).find((d: any) => d.id == route.params?.id)
      if (!item) {
        throw new Error(`Item with id ${route.params?.id} not found`)
      }

      return JSON.stringify(item)
    }
    return data
  }

  private async post(route: any, body: any) {
    const data = (await Deno.readTextFile(route.filePath)).trim()

    let updatedData
    try {
      if (data.startsWith("[") && data.endsWith("]")) {
        body.id = JSON.parse(data).length + 1
        updatedData = [...JSON.parse(data), body]
      } else {
        body.id = 1
        updatedData = [body]
      }
    } catch (e) {
      throw new Error("Invalid JSON file")
    }
    await Deno.writeTextFile(route.filePath, JSON.stringify(updatedData))

    return JSON.stringify(body)
  }

  private async put(route: any, body: any) {
    const data = (await Deno.readTextFile(route.filePath)).trim()

    try {
      if (data.startsWith("[") && data.endsWith("]")) {
        const parsedData = JSON.parse(data)
        let dataToUpdate = parsedData.find((d: any) => d.id == route.params?.id)
        if (!dataToUpdate) {
          throw new Error(`Item with id ${route.params?.id} not found`)
        }

        dataToUpdate = { ...dataToUpdate, ...body, id: dataToUpdate.id }
        await Deno.writeTextFile(route.filePath, JSON.stringify(parsedData))
      }
    } catch (e) {
      throw new Error("Invalid JSON file")
    }

    return JSON.stringify(body)
  }

  private async delete(route: any) {
    const data = (await Deno.readTextFile(route.filePath)).trim()

    try {
      if (data.startsWith("[") && data.endsWith("]")) {
        const leftData = JSON.parse(data).filter((d: any) => d.id != route.params?.id)
        if (!leftData) {
          throw new Error(`Item with id ${route.params?.id} not found`)
        }

        await Deno.writeTextFile(route.filePath, JSON.stringify(leftData))
      }
    } catch (e) {
      throw new Error("Invalid JSON file")
    }

    return
  }
}
