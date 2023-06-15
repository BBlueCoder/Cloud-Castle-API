#!/bin/bash

export cloud_dbAdress=localhost
export cloud_dbPort=5432
export cloud_jwtPrivateKey=${privateKey}
export cloud_dbUser=${database-role}
export cloud_dbName=${database-name}
export cloud_dbPassword=${database-password}
export storagePath=${pathToStoreFiles}
export cloud_redisURL=redis://@localhost:6379

node index.js