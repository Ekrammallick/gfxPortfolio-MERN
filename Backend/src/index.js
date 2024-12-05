import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import thumbRoute from "./routes/thumb.route.js";
import { connectDb } from "./libs/db.js";
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();
const app= express();

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
    })
  );

app.use(
    cors({
        origin:'https://gfxportfolio-mern.onrender.com/',
        credentials:true
    })
)

app.use("/api/auth",authRoute);
app.use("/api/thumb",thumbRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
    });
  }

app.listen(3000,()=>{
    connectDb();
    console.log("Server in running",PORT);
})