import express, { json, text, urlencoded } from "express";
import { router } from "./router";
import cors from "cors";
import http from "http";
import connection from "./db/db";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(json({ limit: "200mb" }));
app.use(text());
app.use(
  urlencoded({ limit: "200mb", extended: true, parameterLimit: 1000000000 })
);
app.use("/api", router);

const server = http.createServer(app);

app.get("/", (req: any, res: any) => {
  res.send({ Message: "Splitwise API running successfully." });
});

server.listen(port, () => {
  console.log("App listening at port: ", port);
});
