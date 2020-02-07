const express = require("express");

//this allows the databse connection:
require("./db/mongoose.js");
//

const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const app = express();
const port = process.env.port;

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  console.log("server is up on port " + port);
});
