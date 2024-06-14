import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import session from "express-session";
import mainRouter from "./routes/main.js";
import adminRouter from "./routes/admin.js";
import isActiveRoute from "./helpers/routeHelpres.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then((connect) => {
    console.log("Connected to database " + connect.connection.host);
  })
  .catch((error) => {
    console.error(error.message);
  });

const loggingMiddleware = (req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
};

app.use(express.static("public"));
app.use(loggingMiddleware);
app.use(expressEjsLayouts);
app.set("layout", "./layout/main");
app.set("view engine", "ejs");
app.use("/", mainRouter);
app.use("/admin", adminRouter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "sessionSecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(methodOverride("_method"));
app.locals.isActiveRoute = isActiveRoute;


app.listen(PORT, console.log("Server running on port " + PORT));

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});