import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";

const app: Express = express();

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);

    app.listen(5000, () => {
      console.log("SERVER STARTED");
    });
  } catch (err) {
    console.log("Server Error", err);
    process.exit(1);
  }
};

startServer();
