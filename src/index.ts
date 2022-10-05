import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from "body-parser";

const app = express();

const port = 8000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(
  // `mongodb+srv://${DB_USER}:${DB_PASSWORD}@shubham0.4cnas.mongodb.net/?retryWrites=true&w=majority`,
  "mongodb+srv://zocketUser:zocket123@shubham0.4cnas.mongodb.net/zocket",
  { useNewUrlParser: true } as ConnectOptions,
  (err) => {
    if (err) {
      console.log("Database not connected" + err);
    } else {
      console.log("Database connected");
    }
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.end("Hello shubbi World!");
});

app.listen(port, () => {
  console.log(`Ready on port ${port}`);
});
