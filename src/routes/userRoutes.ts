import { Router } from "express";
import {addUser, deleteById, followUser, getAllUsers, getUserById, getUserByJWT, getUsersFromSearchString, isUserFollowing, unFollowUser, updateUserById} from "../controller/userController"
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

//To follow a user
userRouter.post("/follow/:id", authenticateUser, followUser)

//To unfollow a user
userRouter.post("/unfollow/:id", authenticateUser, unFollowUser)

//To check if a user is following an other user
userRouter.post("/isFollowing/:id", authenticateUser, isUserFollowing)

export default userRouter;