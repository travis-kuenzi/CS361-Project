import {default as User} from "../models/user.mjs";
import {default as mongoose} from "mongoose";
import bcrypt from 'bcrypt';


async function loginForm(req, res, next) {
    try {
        res.render("login.ejs", { error: false });
    } catch (err) {
        console.error('Error in genreList:', err);
    }
};

async function signupForm(req, res, next) {
    res.render("signup.ejs", {error: false });
}

async function verifyUser(req, res, next) {
    console.log('isNewUser value:', req.body.isNewUser);
    
    // get user data from the request
    const userData = {
        login: {
            username: req.body.username,
            password: req.body.password,
            isNewUser: req.body.isNewUser
        }
    }

    console.log(`Trying to verify ${ userData.login.username } with pass ${ userData.login.password }, new User: ${ userData.login.isNewUser }`);

    // information to connect to microservice via HTTP API
    const url = 'http://localhost:3001/verifyUser';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // what is this???
        },
        body: JSON.stringify(userData) // convert the JavaScript object to a JSON string
    };

    try {
        // send request to the microservice to validate the user data
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // turn the response into json
        const data = await response.json();

        // was the response valid?
        if (data.isValid) {
            // if so, let the user access the home page
            res.render("browseRecipes.ejs");
            // debugging information
            if (userData.login.isNewUser) {
                console.log('Sign up successful for:', data.username);
            } else console.log('Log In successful for:', data.username);
        } else {
            // Debuggin Message
            console.log('Login/Sign Up failed:', data.errorMessage);

            // send the user back to the page and display the error message
            if (userData.login.isNewUser === "true") {
                res.render('signup.ejs', { error: data.errorMessage});
            } else res.render('login.ejs', { error: data.errorMessage });
        }

    } catch (error) {
        console.error('Error making the request:', error);
    }
}


async function verifyLogOut(req, res, next) {
    try {
        res.render("logOutVerifyPage.ejs");
    } catch (err) {
        console.error("Couldn't display verifyLogOut", err);
    }
}

export {loginForm, signupForm, verifyUser, verifyLogOut};


async function createUser(req, res, next) {
        const data = {
            email: req.body.email,
            password: req.body.password
        }
    
        const existingUser = await User.findOne({email: data.email});
        if(existingUser) {
            res.send("user already exists. Please choose a different email.")
        } else {
            // hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    
            data.password = hashedPassword;
            const userdata = await User.insertMany(data);
            console.log(userdata);
    
            res.render("browseRecipes.ejs");
        }
    };
    
//     async function loginUser(req, res, next) {
//         try {
//             const check = await User.findOne({email: req.body.email});
//             if (!check) {
//                 res.send("Email cannot be found");
//             }
    
//             // compare the hash password from the database with the plain text
//             const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
//             if (isPasswordMatch) {
//                 res.render("browseRecipes.ejs");
//             } else {
//                 res.send("wrong password");
//             }
//         } catch {
//             res.send("Wrong Details");
//         }   
//     };