import bodyParser from "body-parser";
import { app } from "./server.js";

// app.use(express.json()); //to parse JSOn data in the req.body
app.use(bodyParser.json()); //to parse JSOn data in the req.body
