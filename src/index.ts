import express from "express";
import userRouter from "./routes/userRoutes";
import tweetRouter from "./routes/tweetRoutes";
import authRouter from "./routes/authRoutes";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/tweets", tweetRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("Listening on port 3000.");
});