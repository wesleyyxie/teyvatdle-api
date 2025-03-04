import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Determine the appropriate status code
  // Default to 500 if no status code has been set
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Set the response status
  res.status(statusCode);

  // Construct the response body
  const responseBody = {
    message: err.message || "An unexpected error occurred",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  };

  // Log the full error details (except in production)
  console.error(`[${new Date().toISOString()}] Error:`, {
    path: req.path,
    method: req.method,
    ...responseBody,
  });

  // Send the error response
  res.json(responseBody);
}
