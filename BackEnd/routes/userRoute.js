import express from "express";
import { registerUser, logInUser } from "../controller/userController.js";

const route = express.Router();

route.post("/registerUser", registerUser);
route.post("/loginUser", logInUser);

export default route;
