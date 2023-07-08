import express from "express";
import userRouter from "./controller/userRoutes";
import tweetRouter from "./controller/tweetRoutes";

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/tweet",tweetRouter);

app.listen(3000, () => {
    console.log("Listening on port 3000.");
});