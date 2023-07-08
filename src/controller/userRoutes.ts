import { Router } from "express";

const userRouter = Router();

userRouter.post("/addUser", (req,res) => {
    res.send("Creating User");
});

userRouter.get("/", (req,res) => {
    res.send("Fetching users");
})

userRouter.get("/:id", (req,res) => {
    const {id} = req.params;
    res.send(`Fetching User of id ${id}`);
});

userRouter.put("/:id", (req,res) => {
    const {id} = req.params;
    res.send(`Updating User of id ${id}`);
});

userRouter.delete("/:id", (req,res) => {
    const {id} = req.params;
    res.send(`Deleting User of id ${id}`);
});

export default userRouter;