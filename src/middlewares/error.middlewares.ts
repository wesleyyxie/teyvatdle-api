import { NextFunction, response } from "express";
import { Request, Response } from "express";
require("dotenv").config();

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);

  const responseBody = {
    message: err.message,
    stack: process.env.NEW_VAR === "production" ? "" : err.stack,
  };

  console.error("Error: ", responseBody);
  res.json(responseBody);
  return;
}
