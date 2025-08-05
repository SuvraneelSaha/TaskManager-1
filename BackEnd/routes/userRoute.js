import express from "express";
import { registerUser } from "../controller/userController.js";

const route = express.Router();

route.post("/registerUser", registerUser);

export default route;
