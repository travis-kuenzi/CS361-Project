import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import mongoose from 'mongoose';
import {default as credentials} from "./dbCredentials.mjs";

// Create an express object
const app = express();

// use json data for app.use methods
app.use(express.json());
// express.urlencoded method
app.use(express.urlencoded({ extended: true }));


// where to find static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'Public')));

// use ejs as a view engine
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

// connect to database
const connection_string = credentials.connection_string;
mongoose.connect(connection_string, {}).catch(err => console.log('Error connecting to MongoDB:', err));


import { default as userRouter } from "./routes/users.mjs";
app.use('/', userRouter);

import { default as recipeRouter } from "./routes/recipes.mjs";
app.use("/recipes", recipeRouter);


// start the app
const port = 3000;
app.listen(port, () => {
    console.log("App listening on port 3000");
});
