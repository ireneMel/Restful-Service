import Book from "./models/book_model.js";

/**
 * This is Data Access Object
 */

export const create = (req, res) => {
    const year = parseInt(req.body.first_publish_year);
    if (year <= 0) {
        res.status(400).send({error: "Invalid year"});
        return;
    }

    const book = new Book({
        author_name: req.body.author_name,
        first_publish_year: req.body.first_publish_year,
        key: req.body.key,
        language: req.body.language,
        title: req.body.title
    });

    book.save().then((data) => {
        res.send(data)
        console.log(`Inserted book ${req.body.title}`)
    }).catch((err) => {
        res.status(500).send({
            book: err.message || "error occurred while creating the book"
        })
    })
}

//return all books from the db
export const findAll = (_, res) => {
    Book.find()
        .then((data) => res.send(data))
        .catch((err) => {
            res.status(500).send({book: err.message || "error occurred while retrieving all the books"});
        });
}

//отримання запису по identifier
export const findOne = (req, res) => {
    Book.findById(req.params.id).then((data) => {
        if (!data) {
            return res.status(404).send({
                error: "Book not found with id: " + req.params.id,
            });
        }
        res.send(data);
    }).catch((err) => {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
                error: "Book not found with id: " + req.params.id,
            });
        }
        return res.status(500).send({
            error: "Error retrieving book with id: " + req.params.id,
        });
    });
}

export const update = (req, res) => {
    const year = req.body.first_publish_year;
    if (year && parseInt(year) <= 0) {
        res.status(400).send({error: "Invalid year"});
        return;
    }

    Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    ).then((data) => {
        if (!data) {
            return res.status(404).send({
                error: `Did not find book with id ${req.params.id} to update`
            });
        }
        console.log(req.body.author_name)
        res.send(data);
    }).catch((err) => {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
                error: "Book not found with id " + req.params.id,
            });
        }
        return res.status(500).send({
            error: "Error updating book with id " + req.params.id,
        });
    });
}

export const deleteOne = (req, res) => {
    Book.findByIdAndRemove(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    error: `Could not find book with id ${req.params.id} to delete`
                })
            }
            res.send(data);
            console.log("Book was deleted")
        }).catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(404).send({error: "Book not found with id " + req.params.id});
        }
        return res.status(500).send({error: "Could not delete book with id " + req.params.id});
    });
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

export const findBefore = (req, res) => {
    filterYear(req, res);
}

export const findAfter = (req, res) => {
    filterYear(req, res, false);
}

function filterYear(req, res, isBefore = true) {
    const year = req.params.year;
    if (year <= 0) {
        return res.status(400).send({error: "Invalid year"});
    }

    Book.find({first_publish_year: isBefore ? {$lt: year} : {$gt: year}})
        .then((books) => {
            res.send({
                number_of_books: books.length,
                books: books
            });
        })
        .catch((err) => {
            res.status(500).send({
                error: err.message || "Error occurred when retrieving books published before/after " + year
            });
        });
}

//{title: 1} - 1 or -1 points to asc/desc
export const sortTitle = (req, res) => {
    Book.find().sort({title: 1}).exec()
        .then((data) => {
            res.send(data);
        }).catch((err) => {
        res.status(500).send({err});
    });
}

export const sortYear = (req, res) => {
    Book.find().sort({first_publish_year: 1}).exec()
        .then((data) => {
            res.send(data);
        }).catch((err) => {
        res.status(500).send({err});
    });
}

export const findAuthor = (req, res) => {
    const authorName = req.query.author_name;
    if (!authorName) {
        return res.status(404).send({error: "No such author name"});
    }
    console.log(authorName)
    Book.find({author_name: {$in: [authorName]}})
        .then((books) => {
            res.send({
                number_of_books: books.length,
                books: books
            });
        }).catch((err) => {
        res.status(500).send({
            error: err.message || "Error occurred when searching for " + q
        });
    });
}


export const findTitle = (req, res) => {
    const title = req.query.title;
    if (!title) {
        return res.status(404).send({error: "No such title"});
    }

    //використовує regex для пошуку заданого префіксу в назві книги, case insensitive
    Book.find({title: {$regex: `^${title}`, $options: "i"}}).then((books) => {
        res.send({
            number_of_books: books.length,
            books: books
        });
    }).catch((err) => {
        res.status(500).send({
            error: err.message || "Error occurred when when looking for books by title prefix " + title
        });
    });
}