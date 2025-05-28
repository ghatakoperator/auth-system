Auth System
A full-stack authentication system comprising a Node.js backend and a frontend interface, designed to provide user registration and authentication functionalities.

Live Demo
Frontend: https://auth-system-smoky.vercel.app

Backend: https://auth-system-s87x.onrender.com

Project Structure
bash
Copy
Edit
auth-system/
├── account-auth-ui/      # Frontend application
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
├── node-auth/            # Backend application
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── .env
│   ├── package.json
│   └── ...
└── README.md
Technologies Used
Frontend:

React.js

SCSS

Axios

Backend:

Node.js

Express.js

Sequelize ORM

MySQL

dotenv

CORS

Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/ghatakoperator/auth-system.git
cd auth-system
2. Backend Setup
bash
Copy
Edit
cd node-auth
npm install
Create a .env file inside node-auth with the following content:

env
Copy
Edit
HOST=your_mysql_host
DB=your_database_name
USER=your_database_user
PASS=your_database_password
Start the backend server:

bash
Copy
Edit
npm start
3. Frontend Setup
bash
Copy
Edit
cd ../account-auth-ui
npm install
Create a .env file inside account-auth-ui with the following content:

env
Copy
Edit
REACT_APP_API_BASE_URL=https://auth-system-s87x.onrender.com
Start the frontend app:

bash
Copy
Edit
npm start
API Endpoints
POST /user/create – Register a new user

POST /user/verify – Authenticate an existing user
POST /user/verifyotp – Authenticate the otp of the user
POST /user/delete – delete the user from database

GET /user/get – Retrieve authenticated user's profile

Testing
Use tools like Postman or cURL to test backend API endpoints.

Ensure the backend server is running before making requests.

The frontend can be tested by visiting http://localhost:3000 in a browser.

Notes
Ensure the MySQL database is publicly accessible and the credentials are correctly configured.

CORS is configured to allow requests from the frontend origin.

Environment variables are used via the dotenv package.
