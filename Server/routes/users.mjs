import {default as express } from "express";
import * as userController from "../controllers/userController.mjs";

const router = express.Router();

router.get("/", userController.loginForm);
router.get("/signup", userController.signupForm);
router.get("/logOutVerify", userController.verifyLogOut);


router.post("/verifyUser", userController.verifyUser);


export default router;
