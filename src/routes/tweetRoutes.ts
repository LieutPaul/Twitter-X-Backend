import { Router } from "express";
import { deleteTweetById, getAllTweets, getTweetById, likeTweet, postTweet, reTweet, unLikeTweet, unReTweet, updateTweetById } from "../controller/tweetController";

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

// Like A Tweet
tweetRouter.post("/likeTweet", likeTweet);

// UnLike a Tweet
tweetRouter.post("/unLikeTweet", unLikeTweet);

// Retweet a Tweet
tweetRouter.post("/reTweet", reTweet);

// UnReTweet a Tweet
tweetRouter.post("/unReTweet", unReTweet);

export default tweetRouter;