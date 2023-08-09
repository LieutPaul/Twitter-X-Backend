import { Router } from "express";
import {addUser, deleteById, followUser, getAllUsers, getFollowers, getFollowersLength, getFollowings, getFollowingsLength, getTweetsOfFollowing, getUserById, getUserByJWT, getUsersFromSearchString, isUserFollowing, unFollowUser, updateUserById} from "../controller/userController"
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

// Get followers list length of a User
userRouter.get("/followers/length/:id", authenticateUser, getFollowersLength)

// Get followings list length of a User
userRouter.get("/followings/length/:id", authenticateUser, getFollowingsLength)


// Get all followers of a User
userRouter.get("/followers/:id", authenticateUser, getFollowers)

// Get all followings of a User
userRouter.get("/followings/:id", authenticateUser, getFollowings)

// Get tweets of the followings of user
userRouter.get("/followingsTweets", authenticateUser, getTweetsOfFollowing);

export default userRouter;