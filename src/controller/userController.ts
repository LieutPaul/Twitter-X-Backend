import { PrismaClient,User } from "@prisma/client";
import express from "express";
import { levenshteinDistance } from "../helper/levenshtein";


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

export const getUsersFromSearchString = async (req: express.Request, res: express.Response) => {
    
    interface UserWithLevenshtein extends User {
        levenshteinDistance: number;
    }
    
    const { searchString } = req.body;
    const users = await prisma.user.findMany({
        where: {
            name: { contains: searchString },
        },
    });
  
    const usersWithLevenshtein: UserWithLevenshtein[] = users.map((user) => {
        const nameDistance = levenshteinDistance(searchString, user.name || '');
        const usernameDistance = levenshteinDistance(searchString, user.username || '');
        return { ...user, levenshteinDistance: Math.min(nameDistance, usernameDistance) };
    });
  
    usersWithLevenshtein.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);
    return res.json(usersWithLevenshtein);

};

export const getUserById = async (req : express.Request,res : express.Response) => {
    
    const {id} = req.body
    const user = await prisma.user.findUnique({ include: {tweets : true}, where : {id: Number(id)}});
    // Will return the tweets by that person as well
    if(user == null){
        res.status(404).send("User not Found.")
    }else{
        res.json(user);
    }

}

export const updateUserById = async (req : express.Request,res : express.Response) => {
    
    const id = req.body.user.id;
    const {bio, name, image,username} = req.body;
    
    try{
        const result = await prisma.user.update({ 
            where : { id : Number(id)},
            data : { bio, name, image, username}
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

export const getUserByJWT = async(req : express.Request,res : express.Response ) => {
    try{
        res.status(200).json(req.body.user.id);
    }catch (e){
        res.status(403).send("User Not Found");
    }
}