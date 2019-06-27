CREATE DATABASE IF NOT EXISTS TODOLIST;

GRANT ALL PRIVILEGES ON *.* to 'user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    status ENUM('todo','in-progress','done') NOT NULL,
    priority ENUM('low','medium','high'),
    description TEXT,
)  ENGINE=INNODB;