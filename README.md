# Cloud-Castle-API
Cloud Castle API is a server-side application built in using `Node.js`. 

## Application Scope
The application is a simple server that you can run in your local network as a local cloud storage to save files and retrieve them. It uses postgres DB to save the metadata of each file. You can host it in your local machine or in docker containers.

## Tech-Stack
This project uses various popular packages in The Node ecosystem.

* Tech-stack
  *  [express](https://www.npmjs.com/package/express)
     + responsible for managing the server and routes.
  *  [pg](https://www.npmjs.com/package/pg)
     + connects with the postgres DB.
  *  [multer](https://www.npmjs.com/package/multer)
     + uploads files to the host.
  *  [redis](https://www.npmjs.com/package/redis)
     + for caching the data.
  *  [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
     + generates a token for authenticating.
  *  [bcrypt](https://www.npmjs.com/package/bcrypt)
     + hashing password.
  *  [cors](https://www.npmjs.com/package/cors)
     + a middleware for express to enable CORS.
  *  [config](https://www.npmjs.com/package/config)
     + configures env variables.
  *  [joi](https://www.npmjs.com/package/joi)
     + validates objects schema.
  *  [winston](https://www.npmjs.com/package/winston)
     + for logging.
  *  [jest](https://www.npmjs.com/package/jest)
     + for writing unit and integration tests.
  *  [supertest](https://www.npmjs.com/package/supertest)
     + tests HTTP calls.
  *  [eslint](https://www.npmjs.com/package/eslint)
     + checks for bugs and code style.
  *  [eslint-html-reporter](https://www.npmjs.com/package/eslint-html-reporter)
     + generates a report for eslint results in html format.
  *  [prettier](https://www.npmjs.com/package/prettier)
     + enforces an unified style.

## Architecture
This project uses a Layered Architecture, it separates the application into multiple layers, each with its own specific responsibility.
By dividing the app into smaller parts, it reduces the complixity and it facilitates maintaining the app. This way we can easily test any part of the app 
and each feature can be developed in isolation.

![Layered Architecture](https://github.com/BBlueCoder/Cloud-Castle-API/blob/master/diagrams/Layered_Architecure.png)

### App Architecture
Inside the app's main folder, you will come across three distinct directories: "routes," "controllers," and "db." The "routes" directory houses the layers responsible for handling the presentation layer. These layers tackle incoming HTTP requests, ensuring their validity, and subsequently pass them to the "controllers" layer. The "controllers" layer, on the other hand, bears the responsibility of executing any business logic. Should it require any data from the database, it communicates with the corresponding layers found within the "db" directory, which efficiently handle all database operations.


## API Reference

#### Get all files

```http
  GET /api/files
```

#### Get file's metadata

```http
  GET /api/files/metadata/${fileId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fileId`      | `Int` | **Required**. Id of file to fetch |


#### Get file 

```http
  GET /api/files/${fileId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fileId`      | `Int` | **Required**. Id of file to fetch |

#### Get file's thumbnail 

```http
  GET /api/files/thumbnail/${fileId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fileId`      | `Int` | **Required**. Id of file to fetch |

#### Add files  

```http
  POST /api/files
```
#### Delete file 

```http
  DELETE /api/files/${fileId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fileId`      | `Int` | **Required**. Id of file to remove |

#### Delete all files 

```http
  DELETE /api/files
```
