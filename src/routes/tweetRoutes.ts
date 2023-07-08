import { Router } from "express";
import { deleteTweetById, getAllTweets, getTweetById, postTweet, updateTweetById } from "../controller/tweetController";

const tweetRouter = Router();


// Get all tweets of a user
tweetRouter.get("/", getAllTweets);

// Posting a Tweet
tweetRouter.post("/postTweet", postTweet);

// Getting a Tweet By Id
tweetRouter.get("/:id", getTweetById);

// Updating a tweet by Id
// tweetRouter.put("/:id", updateTweetById);

// Deleting a tweet by Id
tweetRouter.delete("/:id", deleteTweetById);

export default tweetRouter;