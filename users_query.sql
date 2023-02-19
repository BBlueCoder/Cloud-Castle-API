CREATE TABLE users(
	id serial primary key,
	username varchar(50) unique NOT NULL,
	password varchar(1024) NOT NULL
)