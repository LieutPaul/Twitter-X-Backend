import { Router } from "express";
import { authenticate, handleLoginRequest } from "../controller/authController";

const authRouter = Router();

authRouter.post("/login", handleLoginRequest)

authRouter.post("/authenticate", authenticate)

export default authRouter;