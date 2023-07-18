import express from "express";
import userRouter from "./routes/userRoutes";
import tweetRouter from "./routes/tweetRoutes";
import authRouter from "./routes/authRoutes";
import {authenticateUser} from "./middlewares/authMiddleware";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/tweets", authenticateUser, tweetRouter);
app.use("/auth", authRouter);

app.listen(8080, () => {
    console.log("Listening on port 8080.");
});