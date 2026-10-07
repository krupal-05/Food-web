import dotenv from 'dotenv';
dotenv.config();

import dbConnection from "./src/config/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB connection error:", err);
  });