# Acadsify Project

Acadsify is a comprehensive academic management platform designed to facilitate seamless interaction between students, teachers, and administrators. It provides tools for course management, assignment tracking, scheduling, notifications, and administrative controls.

---

## Prerequisites

- Node.js and npm installed on your system
- MongoDB database access
- Firebase project setup for authentication and real-time data synchronization

---

## Environment Variables Setup

Before running the project, you need to configure environment variables for both the client and server. Please replace the placeholder values in the following files with your actual credentials:

- **Client environment file:** `acadsify-client/.env.local` (or copy from `acadsify-client/.env.example`)

  ```
  VITE_APIKEY=replace_with_your_api_key
  VITE_AUTHDOMAIN=replace_with_your_auth_domain
  VITE_PROJECTID=replace_with_your_project_id
  VITE_STORAGEBUCKET=replace_with_your_storage_bucket
  VITE_MESSAGINGSENDERID=replace_with_your_messaging_sender_id
  VITE_APPID=replace_with_your_app_id
  VITE_IMAGE_HOSTING_KEY=replace_with_your_image_hosting_key
  VITE_API_BASE_URL=replace_with_your_api_base_url
  ```

- **Server environment file:** `acadsify-server/.env` (or copy from `acadsify-server/.env.example`)

  ```
  DB_USER=replace with your MongoDB username
  DB_PASS=replace with your MongoDB password
  ACCESS_TOKEN_SECRET=replace with your access token secret

  FIREBASE_SERVICE_ACCOUNT={
      replace with your firebase service account json
  }

  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=replace with your email address
  SMTP_PASS=replace with your email password
  ```

---

## How to Run the Client

1. Navigate to the client directory:

   ```
   cd acadsify-client
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173` (or the port shown in the terminal).

---

## How to Run the Server

1. Navigate to the server directory:

   ```
   cd acadsify-server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the server:

   ```
   npm start
   ```

4. The server will run on the default port (usually 3000 or as configured).

---

## Additional Notes

- Ensure that your MongoDB instance is running and accessible.
- Make sure Firebase service account JSON is correctly set in the server environment variables.
- Replace all placeholder values in the environment files before running the applications.
- For any issues, refer to the project documentation or contact the project maintainers.

---
