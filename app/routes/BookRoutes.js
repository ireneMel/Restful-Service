import * as DAO from "../controllers/BookController.js"

export default (app) => {
    app.post("/create", DAO.create);

    app.get("/books", DAO.findAll);
    app.get("/book/:id", DAO.findOne);
    //update by ID
    app.put("/book/:id", DAO.update);
    //delete by ID
    app.delete("/book/:id", DAO.deleteOne);

    //Додаткова бізнес логіка
    //1. Фільтраці за роком
    app.get("/books/before/:year", DAO.findBefore);
    app.get("/books/after/:year", DAO.findAfter);
    //2. Сортування
    //  а. Сортування за назвою
    //  б. Сортування за роком
    app.get("/books/sort/title", DAO.sortTitle);
    app.get("/books/sort/year", DAO.sortYear);
    //3. Пошук
    //  a. Пошук всіх книг, які були написані автором
    //  б. Пошук всіх книг, назва яких починається з префіксу
    app.get("/books/search/author", DAO.findAuthor);
    app.get("/books/search/title", DAO.findTitle);

}