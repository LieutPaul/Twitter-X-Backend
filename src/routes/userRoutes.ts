import { Router } from "express";
import {addUser, deleteById, getAllUsers, getUserById, updateUserById} from "../controller/userController"

const userRouter = Router();

// Adding a User
userRouter.post("/addUser", addUser);

// Getting All Users
userRouter.get("/", getAllUsers)

// Getting a User by Id
userRouter.get("/:id", getUserById);

// Updating a User
userRouter.put("/:id", updateUserById);

// Deleting a User
userRouter.delete("/:id", deleteById);

export default userRouter;