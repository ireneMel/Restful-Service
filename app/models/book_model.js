import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    author_name: {type: [String], required: true},
    title: {type: String},
    first_publish_year: {type: Number, required: true},
    key: {type: String, unique: true},
    language: [String],
}, {versionKey: false})

export default mongoose.model("Book", Schema);