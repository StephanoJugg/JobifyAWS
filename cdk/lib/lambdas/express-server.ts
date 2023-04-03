import express, { Request, Response } from "express";
import * as awsServerlessExpress from "aws-serverless-express";
import jobRoutes from "./routes/jobRoutes";

const app = express();

app.get("/api", (req, res) => {
  console.log("request is ", req);
  // print body
  console.log("body is ", req.body);
  // print auth header
  console.log("auth header is ", req.headers.authorization);

  res.send("Hello from API!");
});

app.use("/api/jobs", jobRoutes);

// Handle other routes as needed

const server = awsServerlessExpress.createServer(app);

export const handler = (event: any, context: any) => {
  awsServerlessExpress.proxy(server, event, context);
};
