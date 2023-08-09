import { Router } from "express";
import { addComment, deleteTweetById, getAllTweets, getTweetById, getTweetsByUser, getTweetsLikedByUser, getTweetsRetweetedByUser, likeTweet, postTweet, reTweet, unLikeTweet, unReTweet, updateTweetById } from "../controller/tweetController";

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

// Getting all tweets by a user
tweetRouter.post("/getByUser", getTweetsByUser);

// Getting all tweets liked by a user
tweetRouter.post("/getLikedByUser", getTweetsLikedByUser);

// Getting all tweets retweeted by a user
tweetRouter.post("/getRetweetedByUser", getTweetsRetweetedByUser);

// Adding a comment
tweetRouter.post("/addComment", addComment);

export default tweetRouter;