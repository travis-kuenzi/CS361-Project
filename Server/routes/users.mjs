import {default as express } from "express";
import * as userController from "../controllers/userController.mjs";

const router = express.Router();

router.get("/", userController.loginForm);
router.get("/signup", userController.signupForm);

router.get("/userInformation/:userID", userController.userInformation);
router.get("/logOutVerify", userController.verifyLogOut);


router.post("/verifyUser", userController.verifyUser);
router.post("/logout", userController.logOut);


export default router;
