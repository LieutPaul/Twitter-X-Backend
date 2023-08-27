import { Router } from "express";
import {addUser, deleteById, findUserByUsername, followUser, getAllUsers, getFollowers, getFollowersLength, getFollowings, getFollowingsLength, getTweetsOfFollowing, getUserById, getUserByJWT, getUsersFromSearchString, getUsersFromUsernameSearchString, isUserFollowing, unFollowUser, updateUserById} from "../controller/userController"

const userRouter = Router();

// Adding a User
userRouter.post("/addUser", addUser);

// Getting All Users
userRouter.get("/", getAllUsers)

// Getting a User by Id
userRouter.post("/getById", getUserById);

// Getting a User by Username
userRouter.post("/getByUsername", findUserByUsername);

// Updating a User
userRouter.put("/updateById", updateUserById);

// Deleting a User
userRouter.delete("/:id", deleteById);

// Getting User details from the jwt
userRouter.get("/getByJWT", getUserByJWT);

//Getting a user from searched String
userRouter.post("/userFromSearch", getUsersFromSearchString)

//Getting a user from searched String
userRouter.post("/usernameFromSearch", getUsersFromUsernameSearchString)

//To follow a user
userRouter.post("/follow/:id", followUser)

//To unfollow a user
userRouter.post("/unfollow/:id", unFollowUser)

//To check if a user is following an other user
userRouter.post("/isFollowing/:id", isUserFollowing)

// Get followers list length of a User
userRouter.get("/followers/length/:id", getFollowersLength)

// Get followings list length of a User
userRouter.get("/followings/length/:id", getFollowingsLength)


// Get all followers of a User
userRouter.get("/followers/:id", getFollowers)

// Get all followings of a User
userRouter.get("/followings/:id", getFollowings)

// Get tweets of the followings of user
userRouter.get("/followingsTweets", getTweetsOfFollowing);

export default userRouter;