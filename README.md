### json-server

A simple json api server written in Deno. It's useful for frontend developers who need a quick backend for prototyping without coding

### Usage

##### Installation

Before you'll be able to install the JSON server, you need to have Deno installed on your machine, You can install Deno in any of the following ways depending on your OS as described on [deno.land](https://deno.land/)

Shell (Mac, Linux):

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

PowerShell (Windows):

```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

Homebrew (Mac):

```
brew install deno
```

Chocolatey (Windows):

```
choco install deno
```

Scoop (Windows):

```
scoop install deno
```

Build and install from source using Cargo:

```
cargo install deno --locked
```

You can find more [here](https://deno.land/)

##### Install JSON Server

Now that you have deno installed, you can install json server

```
deno install -Af https://x.nest.land/live-server@0.0.2/json-server.ts
```

Once, installation is complete you can start the JSON server by running

```
json-server
```

If all works fine, then all the JSON files in the directory and nested directories will be served as API endpoints.
The following Methods are supported for all endpoints GET,POST,PUT and DELETE

##### Example

- Create a directory and navigate into it
- Then create a JSON file called users.json in the directory
- Add the following JSON to the newly created JSON file and save the file

```
[
  {
    "id": 1,
    "name": "Abdulrahman Yusuf",
    "username": "bytedeveloper",
    "email": "abdul@testemail.com"
  },
  {
    "id": 2,
    "name": "John Dave",
    "username": "johndave",
    "email": "johndave@examplemail.com"
  }
]

```

- start json-server

```
json-server

```

- Once the server is started you should see a text printed to the console like

```
Serving JSON files from /path/to/json/directory on port 8080
```

- If port 8080 is not available, a random port will be used
- Checkout the endpoint on the port e.g [http://localhost:8080/users](http://localhost:8080/users) or [http://localhost:8080/users.json](http://localhost:8080/users.json)
- Note: if there is a subdirectory containing JSON files, the the route will be mounted in relation to the directories
  e.g subdirector/file.json will be available on http://localhost:8080/subdirectory/file and http://localhost:8080/subdirectory/file.json
- You can add additional data to the JSON using the POST method e.g by sending a POST request to [http://localhost:8080/users](http://localhost:8080/users) or [http://localhost:8080/users.json](http://localhost:8080/users.json) while the request body contains the data to be added
- You can also update JSON file content using the PUT method e.g by sending a PUT request to [http://localhost:8080/users/:id](http://localhost:8080/users/:id) while the request body contains the data to be added
- You can also delete JSON file content using the DELETE method e.g by sending a DELETE request to [http://localhost:8080/users/:id](http://localhost:8080/users/:id)

##### Thank you
