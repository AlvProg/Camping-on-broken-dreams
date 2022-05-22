require("dotenv").config();

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const routes = require("./routes/main");
//const scores = require('./routes/scores');

const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true});
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use("/", routes);

app.use((req, res, next) => {
  res.status(404);
  res.json({ message: "404 - Not Found" });
});

// Errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

// Puerto
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
