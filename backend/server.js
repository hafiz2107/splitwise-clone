const express = require("express");
const app = express();
const port = 5001;
const routes = require("./api/routes/route");
const db = require("./config/db");
const  cors = require('cors')

app.use(cors())

app.use(express.json({
  bodyParser:true
}))
app.use("/", routes);

db.connect((err) => {
  if (err) return console.log("Error connecting to the DB : ", err);

  console.log("Successfull connected to database");
});

app.listen(port, () => console.log("Connected to port 5001"));
