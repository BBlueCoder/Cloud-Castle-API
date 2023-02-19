CREATE TABLE files (
	id serial primary key,
	originname varchar(50),
	savedname varchar(50),
	filetype varchar(50),
	contentlength bigint,
	dateinmillis bigint,
	fileowner int,
	constraint fk_fileowner foreign key (fileowner) references users(id)
)