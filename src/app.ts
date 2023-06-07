import "reflect-metadata";
import AuthenticationRoutes from "./controllers/authentication";
import express = require("express");
import bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
const { json, urlencoded } = bodyParser;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/", AuthenticationRoutes);
// app.use('/test', authenticateJWT, TestRoute) // TBD

export default app;
