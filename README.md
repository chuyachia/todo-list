# Todo list app
Application that allows users to post, edit todo items, see other people's todos and download todos in CSV format.

## Getting started
To try the application, you can either start it locally with docker or visit the [hosted version](https://todolist-cyc-client.herokuapp.com) on Heroku. Note that the hosted version on Heroku might take some times to start up.

####  Start the project with docker
`cd ./docker`

`docker-compose up --no-start`

`docker-compose start`

To clean up

`docker-compose donw -v`

## Structure

The project consists of three parts, a SPA web client, a RESTful API and an Oauth server.

#### Web client [/todo-list-client]
Single Page App web client. React, React Hook, Typescript


#### RESTful API [/todo-list-api]
RESTful API with Hateoas. Spring Boot, Spring Security, SQL 

#### OAuth server [/todo-list-security]
OAuth server supporting Authorization Code flow with PKCE for SPA web client. Spring Boot, Spring Security, SQL 

