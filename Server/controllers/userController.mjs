import session from 'express';


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
            'Content-Type': 'application/json'
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
            // just testing the session
            req.session.userID = data.userID;
            req.session.isAuth = true;
            
            // if so, let the user access the home page
            res.render("browseRecipes.ejs");

            // debugging information
            if (userData.login.isNewUser) {
                console.log('Sign up successful for:', data.username);
            } else console.log('Log In successful for:', data.username);
        } else {
            // Debugging Message
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