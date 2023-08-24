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
    try{
        const allUsers = await prisma.user.findMany();
        res.json(allUsers);
    } catch (e){
        console.log(e);
        res.status(400).send("Could not fetch all users.")
    }  

};

export const getUsersFromSearchString = async (req: express.Request, res: express.Response) => {
    
    try{
        interface UserWithLevenshtein extends User {
            levenshteinDistance: number;
        }
        
        let { searchString } = req.body;
        const users = await prisma.user.findMany({
            where: {
                name: { contains: searchString },
            },
        });
      
        const usersWithLevenshtein: UserWithLevenshtein[] = users.map((user) => {
            const nameDistance = levenshteinDistance(searchString.toLowerCase(), user.name ? user.name.toLowerCase() : '');
            return { ...user, levenshteinDistance : nameDistance };
        });
      
        usersWithLevenshtein.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);
        res.json(usersWithLevenshtein);
        return ;
    }catch (e){
        console.log(e);
        res.status(400).send("Could not get users from search string.")
    }


};

export const getUsersFromUsernameSearchString = async (req: express.Request, res: express.Response) => {
    
    try{
        interface UserWithLevenshtein extends User {
            levenshteinDistance: number;
        }
        
        let { searchString } = req.body;
        const users = await prisma.user.findMany({
            where: {
                username: { contains: searchString },
            },
        });
      
        const usersWithLevenshtein: UserWithLevenshtein[] = users.map((user) => {
            const usernameDistance = levenshteinDistance(searchString.toLowerCase(), user.name ? user.name.toLowerCase() : '');
            return { ...user, levenshteinDistance: usernameDistance };
        });
      
        usersWithLevenshtein.sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);
        res.json(usersWithLevenshtein);
        return ;
    }catch (e){
        console.log(e);
        res.status(400).send("Could not get users from search string.")
    }

};

export const getUserById = async (req : express.Request,res : express.Response) => {
    try{
        const {id} = req.body
        const user = await prisma.user.findUnique({ include: {tweets : true}, where : {id: Number(id)}});
        // Will return the tweets by that person as well
        if(user == null){
            res.status(404).send("User not Found.")
        }else{
            res.json(user);
        }
    } catch(e) {
        console.log(e);
        res.status(400).send("Could not get user from id.")
    }

}

export const findUserByUsername = async (req: express.Request, res: express.Response) => {
    const { username } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            },
        });
  
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return ;
        }
    
        res.status(200).json(user);
        return ;
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        return ;
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

export const followUser = async (req : express.Request, res : express.Response) => {
    const followerId = req.body.user.id, { id } = req.params;
    try{
        await prisma.follow.create({
            data : {
                followerId : Number(followerId),
                followingId : Number(id)
            }
        });
        res.status(200).send("Followed successfully");
    }catch (e){
        res.status(400).send("Could Not Find User.")
    }
}

export const unFollowUser = async(req : express.Request, res : express.Response) => {
    const followerId = req.body.user.id, { id } = req.params;
    try{
        await prisma.follow.deleteMany({
            where : {
                followerId : Number(followerId),
                followingId : Number(id)
            }
        });
        res.status(200).send("Unfollowed successfully");
    }catch (e){
        res.status(400).send("Could Not Find User.")
    }
}

export const isUserFollowing = async (req : express.Request, res : express.Response) => {
    const followerId = req.body.user.id, { id } = req.params;
    try{
        const follows = await prisma.follow.findMany({
            where : {
                followerId : Number(followerId),
                followingId : Number(id)
            }
        });
        if (follows.length > 0) {
            res.status(200).send(true); 
        } else {
            res.status(200).send(false); 
        }
    }catch (e){
        res.status(400).send("Could not determine follow status.")
    }
}

// Get all users followed by a user

export const getFollowings = async (req : express.Request, res : express.Response) => {
    const { id } = req.params;
    try{
        const following = await prisma.follow.findMany({
            where : {
                followerId : Number(id)
            },
            include:{
                following : true
            }
        });
        res.status(200).send(following); 
    }catch (e){
        res.status(400).send("Could not fetch list of followings")
    }
}

// Get all users who follow by a user

export const getFollowers = async (req : express.Request, res : express.Response) => {
    const { id } = req.params;
    try{
        const followers = await prisma.follow.findMany({
            where : {
                followingId : Number(id),
            },
            include:{
                follower : true
            }
        });
        res.status(200).send(followers); 
    }catch (e){
        res.status(400).send("Could not fetch list of followers")
    }
}

export const getFollowingsLength = async (req : express.Request, res : express.Response) => {
    const { id } = req.params;
    try{
        const following = await prisma.follow.findMany({
            where : {
                followerId : Number(id)
            }
        });
        res.status(200).send({length: following.length}); 
    }catch (e){
        res.status(400).send("Could not fetch length of list of followings")
    }
}

export const getFollowersLength = async (req : express.Request, res : express.Response) => {
    const { id } = req.params;
    try{
        const followers = await prisma.follow.findMany({
            where : {
                followingId : Number(id),
            }
        });
        res.status(200).send({length: followers.length}); 
    }catch (e){
        res.status(400).send("Could not fetch length of list of followers")
    }
}


export const getTweetsOfFollowing = async (req : express.Request, res : express.Response) => {
    const userId = req.body.user.id;
    try{
        const tweets = await prisma.follow.findMany({
            where : {
                followerId : Number(userId),
            },
            
            include:{
                following : {
                    include : {
                        tweets : { include :
                                    { user: 
                                        { select:
                                            {
                                                id:true, 
                                                name: true,
                                                image: true,
                                                email : true,
                                                username:true
                                            }
                                        },
                                        likes : { select : { id : true, userId: true, tweetId : true, user : true } },
                                        retweets : { select : { id : true, userId : true, tweetId : true, user : true } },
                                        comments : true
                            },
                           
                        }
                    }
                }
            }
        
        });
        res.status(200).send(tweets);
    }catch (e){
        res.status(400).send("Could not determine follow status.")
    }
}