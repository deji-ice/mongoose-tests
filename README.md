User Authentication System

A simple user authentication and authorization system using Node.js, Express, Mongoose, bcrypt, and JWT.
Features

    User registration with hashed passwords
    User login with JWT generation
    Protected routes for authenticated users

Technologies Used

    Node.js
    Express
    Mongoose
    bcrypt
    jsonwebtoken
    dotenv

Getting Started
Prerequisites

    Node.js
    MongoDB (local or Atlas)

Installation

    Clone the repo:

    bash

git clone https://github.com/yourusername/repo-name.git
cd repo-name

Install dependencies:

bash

npm install

Set up a .env file:

plaintext

SECRET_KEY=your_secret_key
MONGODB_URI=your_mongodb_connection_string

Start the server:

bash

    npm start

API Endpoints
User Registration

    POST /user/register: Create a new user.

User Login

    POST /user/login: Authenticate user and return a JWT.

Get All Users (Protected)

    GET /user/all: Requires JWT in Authorization header.

Usage

Use Postman or similar tools to test the API. Include the JWT in the Authorization header for protected routes.
Contributing

Contributions are welcome!
License

MIT License.
