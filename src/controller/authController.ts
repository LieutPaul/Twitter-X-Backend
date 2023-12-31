import express from "express"
import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_TIME = 10; // The email is valid for 10 minutes 
const JWT_EXPIRATION_DAYS = 30;
const JWT_SECRET = process.env.JWT_SECRET || "";

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

function generateRandomEmailToken() {
    var randomNumber = '';
    for (var i = 0; i < 10; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber.toString();
}

function generateJWT(tokenId : number) : string {
    const jwtInfo = {tokenId};
    return jwt.sign(jwtInfo, JWT_SECRET ,{algorithm:"HS256",noTimestamp:true});
}

export const handleLoginRequest = async (req: express.Request ,res: express.Response) => {
    
    try{
        const { email } = req.body;
        const emailToken = generateRandomEmailToken();
        const expirationTime = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000);
        const username = email.split("@")[0];
        const name = email.split("@")[0];
        const createdToken = await prisma.token.create({
            data: {
                type:"EMAIL", 
                emailToken: emailToken, 
                expiration: expirationTime ,
                user: {
                    connectOrCreate : {
                        where: {email},
                        create : {email,username,name},
                    }
                }
            }
        });
        
        await transporter.sendMail({
            to: email, 
            subject: "Email Token to Login to Twitter Clone", 
            html: `The email token to login to the app is : <br>
                <b>${emailToken}</b>`, 
        });

        res.status(200).send("Sent Email Token");

    }catch (e){
        console.log(e);
        res.status(400).send("Couldn't generate token.")
    }

}

// Validate the token that was sent to the user's email
// Generate JWT for the current user
export const authenticate = async (req : express.Request, res: express.Response) => {
    
    try{
        const {email, emailToken} = req.body;
        const dbEmailToken = await prisma.token.findUnique({where : {emailToken}, include : {user:{select:{email : true}}}});
        const expirationDate = new Date(new Date().getTime() + JWT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);

        if(dbEmailToken == null || !dbEmailToken.valid!){
            res.status(401).send("Could Not Authenticate.");
        }else if(dbEmailToken.expiration < new Date()){
            res.status(401).send("Token Expired.");
        }else{
            if(dbEmailToken!.user!.email != email){
                res.status(401).send("Could Not Authenticate.");
            }else{
                // Valid Token and user combo
                const apiToken = await prisma.token.create({data:{
                    type:"API",
                    expiration : expirationDate,
                    user:{connect:{email}}
                }});
                
                // Invalidate the Email token
                await prisma.token.update({where : {emailToken}, data:{valid : false}});
                
                // Generating JWT
                const jwtToken = generateJWT(apiToken.id);
            
                res.json(jwtToken);
                // When this jwt is verified, the id of the api key which was used to authorize the user is returned
            }   
        }
    } catch (e) {
        console.log(e);
        res.status(400).send("Could not authenticate")
    }
}