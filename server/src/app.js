import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://10.225.151.237:5173", "https://partnerships-developed-pour-election.trycloudflare.com"],
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(cookieParser());

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);

export default app;