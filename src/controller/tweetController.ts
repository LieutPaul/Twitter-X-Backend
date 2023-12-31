import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient({errorFormat: 'minimal'});

export const getTweetsByUser = async (req : express.Request, res : express.Response) => {
    const {userId} = req.body;
    try{
        const userTweets = await prisma.tweet.findMany({ 
            where:{userId : Number(userId)},
            include :
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
        });
        res.json(userTweets);
    }catch (e){
        console.log(e);
        res.status(400).send("Bad Request");
    }
}

export const getTweetsLikedByUser = async (req : express.Request, res : express.Response) => {
    
    const {userId} = req.body;
    
    try{
        const likedTweets = await prisma.like.findMany({
            where: {
              userId: userId,
            },
            include: {
              tweet: {include :
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
                },},
            },
        });
        res.status(200).json(likedTweets);
    }catch (e){
        console.log(e);
        res.status(400).send("Bad Request");
    }
}

export const getTweetsRetweetedByUser = async (req : express.Request, res : express.Response) => {
    
    const {userId} = req.body;
    
    try{
        const retweetedTweets = await prisma.retweet.findMany({
            where: {
              userId: userId,
            },
            include: {
              tweet: {include :
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
                },},
            },
        });
        res.status(200).json(retweetedTweets);
    }catch (e){
        console.log(e);
        res.status(400).send("Bad Request");
    }
}

export const getAllTweets = async (req : express.Request, res : express.Response) => {
    
    try{
        const allTweets = await prisma.tweet.findMany({ include :
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
            
        });
        // This will return the tweet along with the user info (from the foreign key constraint)
        // Only the id and username of the user
        // This will avoid making two separate API Requests
        res.json(allTweets);
    } catch(e) {
        console.log(e);
        res.status(400).send("Could not fetch all tweets.")
    }

}

export const postTweet = async (req : express.Request, res : express.Response) => {
    const {content,image} = req.body;
    const userId = req.body.user.id;

    try{
        const newTweet = await prisma.tweet.create({
            data : {
                content,
                image,
                userId 
            }
        });
        res.json(newTweet); 
    } catch (e){
        res.status(400).send("Bad Request. userId does not exist or null body.");
    }

}

export const likeTweet = async (req : express.Request, res : express.Response) => {

    const {userId, tweetId} = req.body;
    try{
        if(req.body.user.id == userId){
            const like = await prisma.like.create({
                data : {
                    userId,
                    tweetId,
                }
            });
            res.json(like); 
        }else{
            res.status(400).send("Bad Request.");
        }
    } catch (e){
        res.status(400).send("Bad Request. userId/tweetId does not exist or null body.");
    }
}

export const unLikeTweet = async (req : express.Request, res : express.Response) => {
    
    const { userId, tweetId } = req.body;
    try{
        if(req.body.user.id == userId){
            await prisma.like.deleteMany({ 
                where: {
                    userId: Number(userId),
                    tweetId: Number(tweetId)
                }
            });

            res.status(200).send("Unliked successfully");
        }else{
            res.status(400).send("Bad Request.");
        }
    } catch (e){
        res.status(400).send("Bad Request.");
    }

}

export const reTweet = async (req : express.Request, res : express.Response) => {

    const {userId, tweetId} = req.body;
    try{
        if(req.body.user.id == userId){
            const like = await prisma.retweet.create({
                data : {
                    userId,
                    tweetId,
                }
            });
            res.json(like); 
        }else{
            res.status(400).send("Bad Request.");
        }
    } catch (e){
        res.status(400).send("Bad Request. userId/tweetId does not exist or null body.");
    }
}

export const unReTweet = async (req : express.Request, res : express.Response) => {
    
    const { userId, tweetId } = req.body;
    try{
        if(req.body.user.id == userId){
            await prisma.retweet.deleteMany({ 
                where: {
                    userId: Number(userId),
                    tweetId: Number(tweetId)
                }
            });

            res.status(200).send("Unretweeted successfully");
        }else{
            res.status(400).send("Bad Request.");
        }
    } catch (e){
        res.status(400).send("Bad Request.");
    }

}


export const getTweetById = async (req : express.Request , res : express.Response) => {
    try{
        const {id} = req.params;
        const tweet = await prisma.tweet.findUnique({ include :
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
                comments : {select:{content:true,user:true}}
            },
            where : {id: Number(id)}
        });
        if(tweet == null){
            res.status(404).send("Tweet Not Found.")
        }else{
            res.json(tweet);
        }
    } catch (e){
        res.status(404).send("Could not fetch tweet.")
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

export const addComment = async (req : express.Request , res : express.Response) => {
    const {userId,tweetId,content} = req.body;
    try{
        const comment = await prisma.comment.create({
            data : {
                userId : Number(userId),
                tweetId : Number(tweetId),
                content
            }});
        res.status(200).json(comment);
    }catch (e){
        console.log(e);
        res.status(404).send("Could not add Comment.");
    }

}

export const getTweetsOfTrend = async (req : express.Request , res : express.Response) => {
    const trend = req.query.trend;
    try{
        const tweets = await prisma.tweet.findMany({
            where : 
                {content: {
                    contains: `#${trend}`,
                },
            },
            include :
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
        });
        res.status(200).json(tweets);
    }catch (e){
        res.status(400).send("Could not retrieve tweets.")
    }

}

export const searchHashtags = async (req: express.Request, res: express.Response) => {
    const searchTrend = req.query.trend as string;
    const lowercasedSearchTrend = searchTrend.toLowerCase();
    try {
        const tweets = await prisma.tweet.findMany({
            where: {
                content: {
                    contains: lowercasedSearchTrend
                }
            }
        });

        const hashtags: string[] = [];
        const hashtagRegex = /#\w+/g;

        tweets.forEach(tweet => {
            const content = tweet.content;
            const lowercasedContent = content.toLowerCase();
            const matches = lowercasedContent.match(hashtagRegex);
            if (matches) {
                for(var i=0;i<matches.length;i++){
                    if(matches[i].includes(lowercasedSearchTrend)){
                        hashtags.push(matches[i]);
                    }
                }
            }
        });
        const uniqueHashtags: string[] = [];
        hashtags.forEach(hashtag => {
            if (!uniqueHashtags.includes(hashtag)) {
                uniqueHashtags.push(hashtag);
            }
        });
        console.log(uniqueHashtags);
        res.status(200).send(uniqueHashtags);
    } catch (error) {
        res.status(500).send('Could not recover hashtags.');
    }
}