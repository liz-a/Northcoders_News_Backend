# Northcoders News

Northcoders News is a Reddit-style website with a RESTful API. It has a database of articles created by users, with functionality to add comments to articles and to up or down vote all articles and comments. 

Click [here](northcoder-news.herokuapp.com/api) to view all API endpoints.

## Getting Started

### Prerequisites
- Node.js
- MongoDB

Fork the repo and clone:
```
git clone https://github.com/liz-a/Northcoders_News_Backend.git
```

Navigate into folder and install dependencies:
```
npm install
```

Create a config folder at at root level, with config files as below:
```
mkdir config
touch config/index.js
touch config/development.js
touch config/production.js
touch config/test.js
```
Config file content examples:
- index.js:
```
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = require(`./${process.env.NODE_ENV}`);
```
- development.js:
```
module.exports = {
    DB: 'mongodb://localhost:27017/northcoders_news',
    PORT: 9090
}
```
- production.js:
```
module.exports = {
    DB: 'mongodb://user:insert_your_mlab_password_here.mlab.com:27459/northcoders_news'
}
```
-  test.js:
```
module.exports = {
    DB: 'mongodb://localhost:27017/northcoders_news_test',
    PORT: 9090
}
```

Start MongoDB in a new terminal:
```
mongod
```

Seed the database:
```
npm run seed:dev
```

Run the development server:
```
npm run dev
```
In the browser or Postman navigate to: localhost:9090/api, this will serve a set of instructions for navigating to endpoints.

Install Postman to submit post requests:
https://www.getpostman.com

## Running the tests

Tests use Chai, Supertest and Mocha.  If you wish to view the test files open spec/index.spec.js

Test descriptions provided for each test will show when npm test is run.
```
npm test
```

## API Endpoints

Return all topics.

```
GET /api/topics
```

Returns all articles of a given topic.

```
GET /api/topics/:topic/articles
```

Returns all articles.

```
GET /api/articles
```

Returns comments for a given article.

```
GET /api/articles/:article_id/comments
```

Adds a comment to the database.
This route requires a JSON body with a comment key value pair
eg {"comment": "Things I want to say"}

```
POST /api/articles/:article_id/comments
```

Increases or decreases the vote count of a given article by one. This route requires a vote query of 'up' or 'down'.

```
PUT /api/articles/:article_id
```

Increases or decreases the vote count of a given comment by one. This route requires a vote query of 'up' or 'down'.

```
PUT /api/comments/:comment_id
```

Returns the deleted comment and confirmation that comment has been deleted.

```
DELETE /api/comments/:comment_id
```

Returns all users.

```
GET /api/users/
```

Returns all articles by the specified user.

```
GET /api/users/:username/articles
```

## Built With

* [Mongo](https://www.mongodb.com) - Database
* [nodeJS](https://nodejs.org/en/) - Development Environment
* [Express](https://expressjs.com/) - Web Application Framework
* [Heroku](https://id.heroku.com/login) - API Hosting
* [MLab](https://mlab.com/home) - Database Hosting

## Author
[Liz Ardolino](github.com/liz-a)