This file handles the connection to the MongoDB database for the backend of the MERN Recipe Manager application.

## Overview
- Loads environment variables using `dotenv`.
- Connects to MongoDB using the `mongoose` library.
- Exports an async function (`connectDB`) that establishes the connection and logs the status.
- If the connection fails, logs the error and exits the process.

## Usage
This module is imported and executed in the main backend server file (e.g., `server.js`) to initialize the database connection before starting the server.

## Environment Variables
- Requires a `.env` file in the backend root directory with the following variable:
  - `MONGODB_URI` – The connection string for your MongoDB database.

Example `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db?retryWrites=true&w=majority
```

## Running the Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the backend server:
   ```
   node server.js
   ```

## Related Files
- `server.js`: Main backend entry point that imports and runs `connectDB`.
- `.env`: Stores your MongoDB URI and other environment variables.

---
**Note:**
- Ensure MongoDB is accessible from your environment.
- Never commit your `.env` file or credentials to public repositories.
