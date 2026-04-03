import dotenv from "dotenv";

dotenv.config({
    path: ".env"
})

import connectDB from "./db/index.js";
import app from "./app.js";


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
    app.on("error", (error) => {
        console.error("Server error:", error);
    })
})
.catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
})