import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";

import * as homeController from "./controllers/home";
import * as adminController from "./controllers/admin";
import * as apiController from "./controllers/api";
import * as eventsController from "./controllers/events";

const app = express();
export const connectionString = "mongodb://usr:pswd@localhost/admin";
mongoose.Promise = bluebird;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log(path.join(__dirname, "public"));
app.use(
  express.static(path.join(__dirname, "public"),
  //  { maxAge: 31557600000 }
   )
);

app.get("/api/events", apiController.getAllEvents);
app.post("/api/events", apiController.createEvent);
app.get("/api/seed", apiController.Seed);

app.get("/", homeController.index);
app.get("/admin", adminController.getTable);
app.get("/event/:id", eventsController.eventPage);
app.get("/events", eventsController.index);
app.all("*", (req, res) => {
  res.status(404).render("not-found");
});
export default app;

