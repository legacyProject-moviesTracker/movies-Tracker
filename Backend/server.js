const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routers/user.Router");
const movieRoutes = require("./Routers/movies.Router");
const commentsRoutes = require("./Routers/comments.Router");

// initialize the app
const connection = require("./config/connection");
const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:8080"], // Allow these origins
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
//     credentials: true, // Allow cookies and headers like Authorization
//   })
// );

app.use("/user", userRoutes);
app.use("/movies", movieRoutes);
app.use("/comments", commentsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
