import dbConnection from "./src/db/db.js";
import app from "./src/app.js";
import dotenv from 'dotenv';

dotenv.config();

dbConnection();

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});