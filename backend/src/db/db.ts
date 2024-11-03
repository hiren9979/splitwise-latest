import mysql from "mysql";
import dotenv from "dotenv";
import RESPONSES from "../common/response";

dotenv.config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect(function (error) {
  if (!!error) {
    RESPONSES.serverError;
    console.log(error);
  } else {
    console.log("Database Connected Successfully..!!");
  }
});

export default connection;
