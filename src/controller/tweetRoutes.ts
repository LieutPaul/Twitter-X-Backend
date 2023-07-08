import { Router } from "express";

const tweetRouter = Router();

tweetRouter.post("/postTweet", (req,res) => {
    res.send("Creating Tweet");
});

tweetRouter.get("/", (req,res) => {
    res.send("Fetching tweets");
});

tweetRouter.get("/:id", (req,res) => {
    const {id} = req.params;
    res.send(`Fetching tweet of id ${id}`);
});

tweetRouter.put("/:id", (req,res) => {
    const {id} = req.params;
    res.send(`Updating tweet of id ${id}`);
});

tweetRouter.delete("/:id", (req,res) => {
    const {id} = req.params;
    res.send(`Deleting tweet of id ${id}`);
});

export default tweetRouter;