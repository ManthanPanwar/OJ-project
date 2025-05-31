require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/problems", require("./routes/problemRoutes"))

dbConnection()
  .then(() => {
    console.log("DB connection successful!");
    app.listen(process.env.PORT || 5000, () => {
      console.log("server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1); // exit with failure status
  });
