import express from 'express'
import bodyParser from 'body-parser'

import mongoose from "mongoose";
import routes from "./routes/BookRoutes.js";

import('./routes/BookRoutes.js')

const app = express();
const PORT = 8088;

const mongoDB_url = "mongodb://127.0.0.1/local";

mongoose.set('strictQuery', false);

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

routes(app)

app.get('/', (req, res) => {
    res.json({"message": "server is running..."})
})

app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT)
})

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB_url, (err) => {
    if (err) {
        console.log(err);
        process.exit();
    }
    console.log("Successfully connected to mongodb");
})