import "reflect-metadata";
import AuthenticationRoutes from "./controllers/authentication";
import TestRoutes from "./controllers/test";
import UserRoutes from "./controllers/users";
import express = require("express");
import bodyParser = require("body-parser");
import authenticateJWT from "./services/authService";

const app = express();
const cors = require("cors");
const { json, urlencoded } = bodyParser;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/", AuthenticationRoutes);
app.use("/test", authenticateJWT, TestRoutes);
app.use("/users", authenticateJWT, UserRoutes);

export default app;
