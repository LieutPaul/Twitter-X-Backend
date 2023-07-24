import { Router } from "express";
import {addUser, deleteById, getAllUsers, getUserById, getUserByJWT, getUsersFromSearchString, updateUserById} from "../controller/userController"
import { authenticateUser } from "../middlewares/authMiddleware";

const userRouter = Router();

// Adding a User
userRouter.post("/addUser", addUser);

// Getting All Users
userRouter.get("/", authenticateUser, getAllUsers)

// Getting a User by Id
userRouter.post("/getById", authenticateUser, getUserById);

// Updating a User
userRouter.put("/updateById", authenticateUser, updateUserById);

// Deleting a User
userRouter.delete("/:id", deleteById);

// Getting User details from the jwt
userRouter.get("/getByJWT", authenticateUser, getUserByJWT);

//Getting a user from searched String
userRouter.post("/userFromSearch", authenticateUser, getUsersFromSearchString)

export default userRouter;