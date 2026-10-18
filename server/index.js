
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRegisterRoutes = require("./routes/authRegisterRoutes");
const authLoginRoutes = require("./routes/authLoginRoutes");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRegisterRoutes);
app.use("/api/auth", authLoginRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to TripVault API");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
