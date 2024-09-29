const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(bodyParser.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`User Authentication Service running on port ${port}`);
});
