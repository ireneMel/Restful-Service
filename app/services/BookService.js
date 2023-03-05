import Book from "../models/book.js";

export async function createBook(book) {
    return Book.create(book);
}

export async function getAllBooks() {
    return Book.find();
}

export async function findOne(id) {
    return Book.findById(id);
}

export async function update(id, body) {
    return Book.findByIdAndUpdate(id, body, {new: true});
}

export async function deleteOne(id) {
    return Book.findByIdAndRemove(id);
}

export async function filterYear(year, isBefore) {
    return Book.find({first_publish_year: isBefore ? {$lt: year} : {$gt: year}});
}

export async function sortTitle() {
    return Book.find().sort({title: 1}).exec();
}

export async function sortYear() {
    return Book.find().sort({first_publish_year: 1}).exec();
}

export async function findAuthor(authorName) {
    return Book.find({author_name: {$in: [authorName]}});
}

//використовує regex для пошуку заданого префіксу в назві книги, case insensitive
export async function findTitle(title) {
    return Book.find({title: {$regex: `^${title}`, $options: "i"}});
}