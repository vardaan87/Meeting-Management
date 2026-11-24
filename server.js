import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import "./models/Meeting.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/api", meetingRoutes);
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
try {
  await sequelize.authenticate();
  console.log("MySQL connection established.");

  await sequelize.sync();
  console.log("Database tables are ready.");

  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`),
  );
} catch (error) {
  console.error("Unable to start the application:", error.message);
}
