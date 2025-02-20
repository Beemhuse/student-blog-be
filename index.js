import "dotenv/config";
import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Use the postRoutes for "/api/posts"
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);


// **Start the server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
