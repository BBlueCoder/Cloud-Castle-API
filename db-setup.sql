CREATE TABLE users(
	id serial primary key,
	username varchar(50) unique NOT NULL,
	password varchar(1024) NOT NULL
);

CREATE TABLE files (
	id serial primary key,
	originname varchar(500),
	savedname varchar(500),
	filetype varchar(500),
	contentlength bigint,
	dateinmillis bigint,
	fileowner int,
	duration double precision,
	constraint fk_fileowner foreign key (fileowner) references users(id) ON DELETE CASCADE
)