import {default as mongoose} from "mongoose";
import session from 'express';



async function getMealPlan(req, res, next) {
    // get user data from the request
    const userID = req.params.userID;
    const date = req.params.date;

    // Validate userID to ensure it is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({ error: "Invalid userID format" });
    }
    

    // information to connect to microservice via HTTP API
    const url = `http://localhost:3002/getMealPlan/${userID}/${date}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const mealPlan = await response.json();

        //res.send(mealPlan);
        res.render('mealPlan', { mealPlan: mealPlan });
    } catch (error) {
        console.error('Error making the request:', error);
        res.render("browseRecipes");
    }
}

export { getMealPlan }