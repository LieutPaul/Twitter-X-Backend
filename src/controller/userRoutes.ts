import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const userRouter = Router();
const prisma = new PrismaClient();


// Adding a User
userRouter.post("/addUser", async (req,res) => {

    const {email,name,username} = req.body;
    
    try{
        const newUser = await prisma.user.create({
            data : {
                email,
                name,
                username
            }
        });
        res.json(newUser); 
    } catch (e){
        res.status(400).send("Bad Request. Username/name/email null or already exists.");
    }
    
});


// Getting All Users
userRouter.get("/", async (req,res) => {

    const allUsers = await prisma.user.findMany();
    res.json(allUsers);

})


// Getting a User by Id
userRouter.get("/:id", async (req,res) => {
    
    const {id} = req.params;
    const user = await prisma.user.findUnique({ where : {id: Number(id)}});
    // We need to cast id as it is a string when it is extracted from the params
    res.json(user);
    // Will return null if the user of that ID does not exist

});


// Updating a User
userRouter.put("/:id", async (req,res) => {

    const {id} = req.params;
    const {bio, name, image} = req.body;

    try{
        const result = await prisma.user.update({ 
            where : { id : Number(id)},
            data : { bio, name, image}
        });
        // If any of these fields are null, they will not get updated to null
        res.json(result);
    }catch (e){
        res.status(400).send("Could not Update.")
    }

});


// Deleting a User
userRouter.delete("/:id", async (req,res) => {

    const {id} = req.params;
    
    try{
        const user = await prisma.user.delete({where: {id : Number(id)}});
        res.status(200).json(user);
    }catch (e){
        res.status(404).send("User to delete not Found");
    }

});

export default userRouter;