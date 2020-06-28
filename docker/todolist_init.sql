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

CREATE TABLE IF NOT EXISTS oauth_access_token (
    token_id VARCHAR(255),
    token BLOB,
    authentication_id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255),
    client_id VARCHAR(255),
    authentication BLOB,
    refresh_token VARCHAR(255)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS oauth_code (
    code VARCHAR(255),
    authentication BLOB
);

CREATE TABLE IF NOT EXISTS SPRING_SESSION (
    PRIMARY_ID CHAR(36) NOT NULL,
    SESSION_ID CHAR(36) NOT NULL,
    CREATION_TIME BIGINT NOT NULL,
    LAST_ACCESS_TIME BIGINT NOT NULL,
    MAX_INACTIVE_INTERVAL INT NOT NULL,
    EXPIRY_TIME BIGINT NOT NULL,
    PRINCIPAL_NAME VARCHAR(100),
    CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID)
) ENGINE=INNODB;

CREATE UNIQUE INDEX SPRING_SESSION_IX1 ON SPRING_SESSION (SESSION_ID);
CREATE INDEX SPRING_SESSION_IX2 ON SPRING_SESSION (EXPIRY_TIME);
CREATE INDEX SPRING_SESSION_IX3 ON SPRING_SESSION (PRINCIPAL_NAME);

CREATE TABLE IF NOT EXISTS SPRING_SESSION_ATTRIBUTES (
    SESSION_PRIMARY_ID CHAR(36) NOT NULL,
    ATTRIBUTE_NAME VARCHAR(200) NOT NULL,
    ATTRIBUTE_BYTES BLOB NOT NULL,
    CONSTRAINT SPRING_SESSION_ATTRIBUTES_PK PRIMARY KEY (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
    CONSTRAINT SPRING_SESSION_ATTRIBUTES_FK FOREIGN KEY (SESSION_PRIMARY_ID) REFERENCES SPRING_SESSION(PRIMARY_ID) ON DELETE CASCADE
) ENGINE=INNODB;

INSERT INTO users (username, password)
VALUES ('admin','$2a$10$JiHihK0nbeNPLBlqeXYgD.DaVW99FE1FMNl5EpN0CT4I5bFK9lzdC');

USE TODOLIST;

CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
) ENGINE=INNODB;


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
    status VARCHAR(15) NOT NULL,
    priority TINYINT,
    description TEXT,
    username VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    updated_at DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (username) REFERENCES users(username)
    ON DELETE CASCADE
) ENGINE=INNODB;

INSERT INTO users (username)
VALUES ('admin');

INSERT INTO users_roles (username, rolename)
VALUES ('admin', 'A'), ('admin', 'U');
