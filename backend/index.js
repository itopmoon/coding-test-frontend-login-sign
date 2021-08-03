require("dotenv").config();
require("./db");
const express = require("express");
const cors = require("cors");
const { getNonce, getToken } = require("./controllers/auth");
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post("/token", getNonce);
app.post("/auth", getToken);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
