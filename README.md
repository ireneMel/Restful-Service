# Restful-Service

RESTful API written in Node.js using the Express framework.
Follows RESTful principles of using HTTP methods (POST, DELETE, GET, PUT)

## The API supports the following operations:
#CRUD operations:
* Create a new book
* Retrieve all books
* Retrieve a single book by ID
* Update a book by ID
* Delete a book by ID
#Additional business logic
* Filter books by publication year (before/after a certain year)
* Sort books by title or publication year
* Search books by title or author


The data access is encapsulated in a set of controllers that
    * handle requests
    * perform validation
    * interact with MongoDB through mongoose library

The API is structured in a modular way - each route is handled by separate controller function
