import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

export const getAllTweets = async (req : express.Request, res : express.Response) => {
    
    const allTweets = await prisma.tweet.findMany({ include :
         { user: 
            { select:
                {
                    id:true, 
                    name: true,
                    image: true,
                    username:true
                }
            }
        }
    });
    // This will return the tweet along with the user info (from the foreign key constraint)
    // Only the id and username of the user
    // This will avoid making two separate API Requests
    res.json(allTweets);

}

export const postTweet = async (req : express.Request, res : express.Response) => {

    const {content,image,userId} = req.body;
    
    try{
        const newTweet = await prisma.tweet.create({
            data : {
                content,
                image,
                userId // Change to do based on JWT
            }
        });
        res.json(newTweet); 
    } catch (e){
        res.status(400).send("Bad Request. userId does not exist or null body.");
    }

}

export const getTweetById = async (req : express.Request , res : express.Response) => {
    const {id} = req.params;
    const tweet = await prisma.tweet.findUnique({ include :
        { user: 
           { select:
               {
                   id:true, 
                   name: true,
                   image: true,
                   username:true
               }
           }
       }, 
       where : {id: Number(id)}
    });
    
    if(tweet == null){
        res.status(404).send("Tweet Not Found.")
    }else{
        res.json(tweet);
    }
}

export const updateTweetById = async (req : express.Request , res : express.Response) => {
    const {id} = req.params;
    const {content, image} = req.body;

    try{
        const result = await prisma.tweet.update({ 
            where : { id : Number(id)},
            data : { content, image}
        });
        // If any of these fields are null, they will not get updated to null
        res.json(result);
    }catch (e){
        res.status(400).send("Could not Update.")
    }
}

export const deleteTweetById = async (req : express.Request , res : express.Response) => {
    const {id} = req.params;

    try{
        const tweet = await prisma.tweet.delete({where: {id : Number(id)}});
        res.status(200).json(tweet);
    }catch (e){
        res.status(404).send("Tweet to delete not Found");
    }

}