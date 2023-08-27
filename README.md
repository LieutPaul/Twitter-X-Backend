# Twitter-X Backend Repository

## Description and Tech Stack

The following repository contains the code to the backend of Twitter-X, a twitter clone created by Vikas K.\
The project uses:
- Typescript (ts-node) 
- Express to expose the REST Endpoints in the code 
- Prisma Client as an ORM and the client uses SQLite as the database.

DB-Schema:

![ER-Diagram](https://github.com/LieutPaul/Twitter-X-Backend/blob/main/TwitterX-ER-Diagram.png)

## How to Run the project
The local machine requires node and javascript to be installed locally on the machine.
After cloning the repository, run the following commands to start the backend server:

```shell
$ npm install
$ npm run dev
```

## REST Endpoints

- User Routes:

HTTP Method | Endpoint | Route Description |
--- | --- | --- |
POST | /users/addUser | Stores a new user with their name, username and email. By default, from the frontend, the name and username are the part before the '@' in the email.|
GET | /users | Returns a list of all users. User needs to be authenticated to access this route. |
POST | /users/getById | Returns a user that corresponds to the id passed in the body of the request. User needs to be authenticated to access this route. |
PUT | /users/updateById | Updates any of the fields from bio, name, username that corresponds to the id of the user retrieved from the JWT. User needs to be authenticated to access this route. |
DELETE | /users/:id | Deletes the user that corresponds to the id passed in the request parameters. |
GET | /users/getByJWT | Returns the entire user object that corresponds to the user-id from the JWT passed from the frontend. User needs to be authenticated to access this route. |
POST | /users/userFromSearch | Returns a list of users whose name contains the search string passed in the request body. Sorts the list of users in terms of levenshtien distance between the name of the user and the search string, so that it can be displayed in the same order in the frontend.|
POST | /users/usernameFromSearch | Returns a list of users whose username contains the search string passed in the request body. Sorts the list of users in terms of levenshtien distance between the name of the user and the search string, so that it can be displayed in the same order in the frontend.|
POST | /users/follow/:id | Allows a user to follow another user. The following user is taken from the JWT and the user to be followed is taken from request params. |
POST | /users/unfollow/:id | Allows a user to un-follow another user. The following user is taken from the JWT and the user to be unfollowed is taken from request params. |
POST | /users/isFollowing/:id | Checks if a user is followed by another user. The following user is taken from the JWT and the user who we want to check is being followed or not is taken from request params. |
GET | /users/followers/length/:id | Returns the number of users who follow a particular user. The ID of the user is taken from the request params. |
GET | /users/followings/length/:id | Returns the number of users followed by a particular user. The ID of the user is taken from the request params. |
GET | /users/followers/:id | Returns the list of users who follow a particular user. The ID of the user is taken from the request params. |
GET | /users/followings/:id | Returns the list of users that a particular user follows. The ID of the user is taken from the request params. |
GET | /users/followingsTweets/ | Returns the list of tweets tweeted by all the users that a particular user follows. |


- Tweet Routes (All the routes require the user to be authenticated) : 

HTTP Method | Endpoint | Route Description |
--- | --- | --- |
GET | /tweets | Returns a list of all tweets from all users. |
POST | /tweets/addTweet | Adds a tweet of a user (from the jwt) with the tweet content, and possibly a link to an image may be passed from the frontend. |
GET | /tweets/:id | Returns a tweet that corresponds to the id passed in the request parameters. |
POST | /tweets/likeTweet | The userId (of the user liking the tweet) and tweetId (of the tweet) are passed in the request body and makes the user like that tweet |
POST | /tweets/unLikeTweet | The userId (of the user liking the tweet) and tweetId (of the tweet) are passed in the request body and makes the user unlike that tweet |
POST | /tweets/reTweet | The userId (of the user liking the tweet) and tweetId (of the tweet) are passed in the request body and makes the user retweet that tweet |
POST | /tweets/unReTweet | The userId (of the user liking the tweet) and tweetId (of the tweet) are passed in the request body and makes the user unretweet that tweet |
POST | /tweets/getByUser | The userId is passed in the request body and returns all the tweets tweeted by that user. |
POST | /tweets/getLikedByUser | The userId is passed in the request body and returns all the tweets liked by that user. |
POST | /tweets/getRetweetedByUser | The userId is passed in the request body and returns all the tweets retweeted by that user. |
POST | /tweets/addComment | The userId, tweetId, comment-content is passed in the request body and adds a comment by that user for that tweet with the given content. |
GET | /tweets/trending | Fetches all the tweets that contain a particlaur trend(#). The trend is taken as a request parameter. |
GET | /tweets/trendsFromSearch | Fetches all the tweets where the trends in the tweet contain a particular trend as a substring. The substring-trend is taken as a request parameter. |

- Auth routes : 

HTTP Method | Endpoint | Route Description |
--- | --- | --- |
POST | /login | An email-id is taken from the request body. A random 10 digit token is generated and an expiration time is generated for the token. This "EMAIL" token is added to the token table and an email is sent to the user with the token. |
POST | /authenticate | An email-id and the email-token is taken from the request body. We authenticate the user by checking if there is a valid token with the same token exists in the table for the given email-id. If there is, we generate an "API" token with an expiration date and add it to the token table (along with the user information) and generate a JWT with the API token id and send it to the frontend |

- MiddleWares/Functions : 

Function | Description |
--- | --- |
authenticateUser | A JWT is accepted from the frontend. The API token id is retrieved from the JWT and the user is retrieved from the token table with the token id and is attached to the body of the request. |
levenshtein | Measures the difference between two sequences. It is used to find the usernames that are closest to the search string searched by the user. |