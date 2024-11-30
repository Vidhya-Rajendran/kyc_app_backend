# KYC App Backend

KYC Management Application Backend built with Node.js and Express. The backend handles user authentication, KYC form submissions, admin approval/rejection workflows, and stores data in MongoDB. Includes JWT-based authentication, role-based access control, and API endpoints to manage KYC processes.

## Features
- **User Authentication**: JWT-based authentication with role-based access (Admin/User).
- **KYC Form Handling**: API for submitting, updating, and retrieving KYC forms.
- **Admin Dashboard**: Admins can approve or reject KYC submissions via API endpoints.
- **Data Storage**: Uses **MongoDB** for KYC data storage.
- **API Security**: Secured API endpoints with JWT and role-based access control.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB
- **API Testing**: Postman / Jest 
- **Environment Variables**: dotenv for managing environment settings.

## Installation

### Prerequisites:
- Node.js (>=14.x)
- npm (>=7.x)
- Database (MongoDB)

### Steps to Set Up:
1. Clone the repository:
   ```bash
   git clone https://github.com/Vidhya-Rajendran/kyc_app_backend.git

2. Navigate to the project directory:
   ```bash
   cd kyc_app_backend

3. Install dependencies:
   ```bash
   npm install

4. Set up environment variables:
   
   Create a .env file in the root directory.
   Add necessary variables like database connection strings, JWT secret, etc. Eg:
   ```bash
   DB_HOST=localhost
   DB_USER=username
   DB_PASSWORD=password
   PORT=4000
   JWT_SECRET=your_jwt_secret

5. Start the development server:
    ```bash
    npm start

6. The backend should now be running on:
    ```bash
    http://localhost:4000
    



