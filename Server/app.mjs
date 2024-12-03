import express from 'express';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import path from 'path';
import {fileURLToPath} from 'url';
import mongoose from 'mongoose';
import {default as credentials} from "./dbCredentials.mjs";

// Create an express object
const app = express();


const MongoDBSession = connectMongoDBSession(session);

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
mongoose
    .connect(connection_string, {})
    .then((res) => { console.log("MongoDB Connected"); })
    .catch(err => console.log('Error connecting to MongoDB:', err));

    
const store = new MongoDBSession({
    uri: connection_string,
    collection: 'mealPlanAppSessions',
})

app.use(session({
    secret: 'key that will sign cookie saved to browser',
    resave: false, // don't create a new session with every request
    saveUninitialized: false, // don't save session if it has not been modified
    store: store,
}))


import { default as userRouter } from "./routes/users.mjs";
app.use('/', userRouter);

import { default as recipeRouter } from "./routes/recipes.mjs";
app.use("/recipes", recipeRouter);

import { default as mealPlanRouter } from "./routes/mealPlans.mjs";
app.use("/mealPlans", mealPlanRouter);



// start the app
const port = 3000;
app.listen(port, () => {
    console.log("App listening on port 3000");
});
