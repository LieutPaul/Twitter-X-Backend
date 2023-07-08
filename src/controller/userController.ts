import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

export const addUser = async (req : express.Request, res : express.Response) => {

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
    
};

export const getAllUsers = async (req : express.Request ,res : express.Response) => {

    const allUsers = await prisma.user.findMany();
    res.json(allUsers);

};

export const getUserById = async (req : express.Request,res : express.Response) => {
    
    const {id} = req.params;
    const user = await prisma.user.findUnique({ include: {tweets : true}, where : {id: Number(id)}});
    // Will return the tweets by that person as well
    if(user == null){
        res.status(404).send("User not Found.")
    }else{
        res.json(user);
    }

}

export const updateUserById = async (req : express.Request,res : express.Response) => {

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

}

export const deleteById = async (req : express.Request,res : express.Response) => {

    const {id} = req.params;
    
    try{
        const user = await prisma.user.delete({where: {id : Number(id)}});
        res.status(200).json(user);
    }catch (e){
        res.status(404).send("User to delete not Found");
    }

}