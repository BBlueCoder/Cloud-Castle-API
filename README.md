# Cloud-Castle-API
Cloud Castle API is a server-side application built in using `Node.js`. 

## Application Scope
The application is a simple server that you can run in your local network as a local cloud storage to save files and retrieve them. It uses postgres DB to save the metadata of each file. You can host it in your local machine or in docker containers.

- [Tech-Stack](#tech-stack)
- [Architecture](#architecture)
- [App Architecture](#app-architecture)
- [Getting Started](#getting-started)
  - [Install Node.js](#install-nodejs)
  - [Install Postgres](#install-postgres)
  - [Create the Database](#create-the-database)
  - [Install Redis](#install-redis)
  - [Clone the project](#clone-the-project)
  - [Run Locally](#clone-the-project)
- [API Reference](#api-reference)

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

![App Workflow](https://github.com/BBlueCoder/Cloud-Castle-API/blob/master/diagrams/app_workflow.png)

## Getting Started
To run the app in your machine follow these steps 

#### Install Node.js
Download and install [`Node.js`](https://nodejs.org/en/download) in your machine.

#### Install Postgres
This app uses a postgres DB, check the official [link](https://www.postgresql.org/download/) and donwload postgres then install it in your machine.

##### Create the Database
After you install the app, it is time to create the database.
You can use either [`psql cli`](https://www.postgresql.org/docs/current/app-psql.html) or ['pgAdmin'](https://www.pgadmin.org/) to run any sql query in postgres. 
 * Create Role :
```sql
  CREATE ROLE role_name WITH LOGIN PASSWORD 'role_password';
  ```
 * Add persmission to create databases to the role :
```sql
  ALTER ROLE role_name CREATEDB;
  ```
 * Create database :
```sql
  CREATE DATABASE db_name;
  ```
 * Create tables :
   Copy the script in the [`db-setup.sql`](https://github.com/BBlueCoder/Cloud-Castle-API/blob/master/db-setup.sql) and run it.

#### Install Redis
The app use `Redis` for caching, check the official [link](https://redis.io/docs/getting-started/installation/) and install it.

After you install redis, you need to run it, use `redis-server` command to start redis.

`Note : The app can work without redis.`

#### Clone the project
Clone the project to your machine :
```bash
   git clone https://github.com/BBlueCoder/Cloud-Castle-API.git
  ```
Go to the project directory

```bash
  cd Cloud-Castle-API
```

Install dependencies

```bash
  npm install
```

#### Run locally
After you finish all the previous steps you are ready to launch the app.

Open the [`run-app-script.sh`](https://github.com/BBlueCoder/Cloud-Castle-API/blob/master/run-app-script.sh) file and replace the values with your values.

Be default postgres uses port 5432, and redis uses port 6379, don't change those unless you change the default ports.

Run `./run-app-script.sh` after you change the values of the env variables.

To check if everything is working fine, you can send a `GET` request to `http://localhost:3000/api/health`, it will send back a response like this :
```json
   {
    "server": "192.168.100.80",
    "database": true,
    "cache": false
   }
 ```
if the connection is successful it will return true, if not it will return false. 

## API Reference
The app returns every response in a json format.

To make any request to `files` endpoint you must send an `Authentication` header that has a `token` in the request's headers.

To obtain a token you must login, or signup if you don't have an account yet.

The token is valid for 35 minutes.

![App Workflow](https://github.com/BBlueCoder/Cloud-Castle-API/blob/master/diagrams/api_endpoints.png)

#### Create an acount

```http
  POST /api/users/signup
```

Send a json body in this format : 

```json
   {
     "username":"user1",
     "password":"Passw@rd"
   }
 ```

#### Login

```http
  POST /api/users/login
```

Send the same body as the previous request.

#### Get all files

```http
  GET /api/files
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `limit`      | `Int` | **Optional**. for pagging define the limit |
| `offset`      | `Int` | **Optional**. for pagging define the offset |
| `sort_order`      | `String` | **Optional**. by default sort is descending, send `asc` if you want to sort the order to be ascending|
| `file_type`      | `String` | **Optional**. to filter the files send the type of files you want|

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
