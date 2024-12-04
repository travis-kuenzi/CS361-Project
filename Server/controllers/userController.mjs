import session from 'express';


async function loginForm(req, res, next) {
    res.render("login", { error: false });
};

async function signupForm(req, res, next) {
    res.render("signup", {error: false });
}

async function verifyUser(req, res, next) {
    console.log("running verifyUser in the userController.\n");
    // get user data from the request
    const userData = {
        login: {
            username: req.body.username,
            password: req.body.password,
            isNewUser: req.body.isNewUser
        }
    }
    console.log(userData);
    console.log("\n");

    // information to connect to microservice via HTTP API
    const url = 'http://localhost:3001/verifyUser';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // convert the JavaScript object to a JSON string
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            res.render('error.ejs', { error: 'Fetch failed!\n' });
        }

        // turn the response into json
        const data = await response.json();
        console.log("Response from microservice:\n");
        console.log(data);

        // was the user info valid?
        if (data.isValid) {

            console.log(`Sesssion userID was: ${req.session.userID}`);
            
            // set the userID for the session
            req.session.userID = data.userID;
            req.session.save((err) => {
                if (err) {
                    console.error("Error saving session:", err);
                } else {
                    console.log("Session saved successfully.");
                }
            });
            
            console.log("Session userID after updating:", req.session.userID); // DEBUGGING

            // debugging information
            if (userData.login.isNewUser == "true") {
                console.log('Sign up successful for:', data.username);
            } else console.log('Log In successful for:', data.username);

            console.log("Now redirecting to browseRecipes page: \n")
            res.redirect('/recipes'); 
        } else {
            // send the user back to the page and display the error message
            if (userData.login.isNewUser == "true") {
                res.render('signup.ejs', { error: data.errorMessage});
            } else res.render('login.ejs', { error: data.errorMessage });
        }
    } catch {
        console.error('Error making the request!');

        res.render('error.ejs', { error: 'An internal server error occurred. Please try again later.' });
    }
}


async function verifyLogOut(req, res, next) {
    try {
        res.render("logOutVerifyPage.ejs");
    } catch (err) {
        console.error("Couldn't display verifyLogOut", err);
    }
}

async function userInformation(req, res, next) {
    const userID = req.session.userID;
    
    res.send(userID);

    if (!userID) {
        return res.status(404).send("User ID not found in session.");
    }
}

async function logOut(req, res, next) {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect("/")
    })
}

export {loginForm, signupForm, verifyUser, verifyLogOut, userInformation, logOut};