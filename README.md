# Redis, S3 Bucket & Typescript Integration: Boost Your Project with this Powerful Combination

# Introduction

## Implementation of Simple Express.js App with Redis for Rate Limiting and Cached Data

![redis-diagram](https://github.com/SahadevDahit/redis-s3-bucket/assets/81854544/6d64bd44-0867-4529-a954-f3af364aaeb7)

1. **Redis Usage**: The code utilizes Redis, a key-value store, for caching information related to sign-up attempts.
2. **IP-based Rate Limiting**: Sign-up attempts are tracked and limited on a per-IP basis. The IP address is obtained from the incoming request.
3. **Redis Keys and Values**:
    - A unique key is generated for each IP address, representing the sign-up attempts for that specific IP (`attemptsKey`).
    - The count of sign-up attempts is stored in a hash named 'signupAttempts' with keys corresponding to IP addresses.
4. **Rate Limiting Logic**:
    - If the number of sign-up attempts from a particular IP exceeds a predefined threshold (5 in this case), further sign-up attempts from that IP are rejected with a 429 status code, indicating "Too Many Requests."
5. **Expiration of Keys**:
    - To prevent indefinite tracking, each IP key in the 'signupAttempts' hash has a time-to-live (TTL) of 60 seconds, and the entire 'loginAttempts' hash has a TTL of 1 hour.
6. **Error Handling**:
    - The code includes error handling to deal with potential exceptions during the rate-limiting process and logs detailed error information.
7. **Response Handling**:
    - Successful user creations are responded with a 201 status code, and errors are appropriately handled and communicated in the response.
8. **Clean-up and Closing Connections**:
    - Finally, the code ensures proper cleanup by setting a TTL for the hash and closing the Redis connection.

*To improve security and performance, a simple Express.js app can be integrated with Redis for rate limiting and cached data. Here are some key points:*

- ***Rate Limiting***: By using Redis, you can implement rate limiting to prevent abuse and protect your server from excessive requests. Redis provides efficient data structures like* ***sorted sets*** *and* ***counters*** *to track and limit the number of requests from a specific IP address or user.*
- ***Cached Data***: Redis can be used as a caching layer to store frequently accessed data and reduce the load on your main database. By caching data, you can significantly improve the response time and overall performance of your application. You can store JSON objects, HTML fragments, or any other serialized data in Redis.*

## *Integration of MongoDB for Database and S3 Bucket for Image Storage*

*In addition to Redis, you can integrate MongoDB as the main database and an S3 bucket in AWS for storing image data. Here's how it can be done:*

- ***MongoDB***: MongoDB is a popular NoSQL database that provides flexible data modeling and scalability.*
- ***S3 Bucket***: Amazon S3 (Simple Storage Service) is a cloud storage service provided by AWS. You can create an S3 bucket to store image files uploaded by users in your Express.js app. With S3, you get durable and scalable storage, built-in security features, and easy integration with other AWS services.*

*By integrating Redis for rate limiting and cached data, MongoDB for the main database, and an S3 bucket for image storage, you can enhance the security, performance, and scalability of your project.*

---

Set up the project

1. Clone the repository
    
    ```jsx
    git clone
    
    ```
    
2. Run the following command
    
    ```jsx
    npm install
    
    ```
    
3. Rename .env.txt to .env to setup the enviroment variables

You need to create the IAM user from your root account and provide permission to acess the s3 bucket. And create access key for IAM user. Make sure that your ACLs is enabled.


![s3bucket](https://github.com/SahadevDahit/redis-s3-bucket/assets/81854544/7bdd12b6-d907-4a41-b8cd-b6ed199fd0c9)


1. For redis server connection
    
    Create an account in upstack [https://upstash.com/](https://upstash.com/)
    
    Then create redis database to get the required env variables.
    ![redisServer](https://github.com/SahadevDahit/redis-s3-bucket/assets/81854544/db8c34f1-d2a6-4a18-b91d-1917c381938a)

    
    1. Make sure that you have proper mongoose connection
    2. And finally run the following command
        
        ```jsx
        npm run serve
        
        ```
