# Cloud-Castle-API
A REST-API that stores files on server and save its data on a Postgress database. Built using `Express.js` framework.


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
