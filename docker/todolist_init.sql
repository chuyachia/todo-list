CREATE DATABASE IF NOT EXISTS TODOLIST;

CREATE DATABASE IF NOT EXISTS SECURITY;

CREATE USER 'user'@'%' IDENTIFIED BY 'user';
GRANT ALL PRIVILEGES ON *.* to 'user'@'%';
FLUSH PRIVILEGES;

CREATE USER 'todolist'@'%' IDENTIFIED BY 'todolist';
GRANT ALL PRIVILEGES ON TODOLIST.* to 'todolist'@'%';
FLUSH PRIVILEGES;

CREATE USER 'security'@'%' IDENTIFIED BY 'security';
GRANT ALL PRIVILEGES ON SECURITY.* to 'security'@'%';
FLUSH PRIVILEGES;

USE SECURITY;

CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
)  ENGINE=INNODB;

INSERT INTO users (username, password)
VALUES ('admin','$2a$10$JiHihK0nbeNPLBlqeXYgD.DaVW99FE1FMNl5EpN0CT4I5bFK9lzdC');

USE TODOLIST;

CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS users_roles (
    username VARCHAR(255) NOT NULL,
    rolename VARCHAR(30) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
    PRIMARY KEY (username, rolename)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS todos (
    id INTEGER AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    status TEXT NOT NULL,
    priority TEXT,
    description TEXT,
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (username) REFERENCES users(username)
    ON DELETE CASCADE
)  ENGINE=INNODB;

INSERT INTO users (username)
VALUES ('admin');

INSERT INTO users_roles (username, rolename)
VALUES ('admin', 'A'), ('admin', 'U');
