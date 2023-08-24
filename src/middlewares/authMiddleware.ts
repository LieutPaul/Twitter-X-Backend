import express from "express"
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "";
const prisma = new PrismaClient();

export const authenticateUser = async (req : express.Request, res : express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"]
    const userJwt = authHeader?.split(' ')[1];
    
    if(!userJwt){
        return res.status(401).send("Unauthorized");
    }
    
    try{
        const payload = jwt.verify(userJwt,JWT_SECRET) as {tokenId : number};
        const apiToken = await prisma.token.findUnique({where: {id: payload.tokenId}, include : {user:true}});
        
        if(apiToken == null || apiToken?.valid == false || (apiToken.expiration < new Date()) ){
            res.status(401).send("Unauthorized");
        }
        req.body.user = apiToken?.user;
        next();
    }catch(e){
        res.status(401).send("Unauthorized");
    }
}