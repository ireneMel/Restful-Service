import Book from "../models/book.js";
import * as bookService from "../services/BookService.js"

export const create = async (req, res) => {
    try {
        const year = parseInt(req.body.first_publish_year);
        if (year <= 0) {
            res.sendStatus(400).json({error: "Invalid year"});
            return;
        }
        const book = await bookService.createBook(req.body);
        res.json(book);
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

//return all books from the db
export const findAll = async (_, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.json(books)
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

//отримання запису по identifier
export const findOne = async (req, res) => {
    try {
        const book = await bookService.findOne(req.params.id);
        res.json(book)
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

export const update = async (req, res) => {
    try {
        const year = req.body.first_publish_year;
        if (year && parseInt(year) <= 0) {
            res.sendStatus(400).send({error: "Invalid year"});
            return;
        }
        const book = await bookService.update(req.params.id, req.body);
        res.json(book);
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

export const deleteOne = async (req, res) => {
    try {
        const book = await bookService.deleteOne(req.params.id);
        res.json({book: book, message: "Book was deleted successfully"});
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

/*
Фільтрація
    * книги, видані до РОКУ
    * книги, видані після РОКУ
Сортування
    * за title
    * за роком
Пошук за параметрами
    * пошук за title
    * пошук за одним з авторів
        (якщо масив авторів містить автора, повертаємо книгу)
 */

export const findBefore = async (req, res) => {
    await filterYear(req, res);
}

export const findAfter = async (req, res) => {
    await filterYear(req, res, false);
}

async function filterYear(req, res, isBefore = true) {
    try {
        const year = req.params.year;
        if (year <= 0)
            return res.status(400).send({error: "Invalid year"});
        const book = await bookService.filterYear(year, isBefore);
        res.json(book);
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

//{title: 1} - 1 or -1 points to asc/desc
export const sortTitle = async (req, res) => {
    try {
        const books = await bookService.sortTitle();
        res.json(books);
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

export const sortYear = async (req, res) => {
    try {
        const books = await bookService.sortYear();
        res.json(books);
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

//example : http://localhost:8088/books/search/author?author_name=Geeta Dayal
export const findAuthor = async (req, res) => {
    try {
        const authorName = req.query.author_name;
        if (!authorName)
            return res.status(404).send({error: "No author name"});
        const books = await bookService.findAuthor(authorName);
        res.send({
            number_of_books: books.length,
            books: books
        });
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}

//використовує regex для пошуку заданого префіксу в назві книги, case insensitive
export const findTitle = async (req, res) => {
    try {
        const title = req.query.title;
        if (!title) {
            return res.status(404).send({error: "No such title"});
        }
        const books = await bookService.findTitle(title);
        res.json(books)
    } catch (e) {
        res.json({error: e.message, status: "500"});
    }
}