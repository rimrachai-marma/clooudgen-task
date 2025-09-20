import { logger } from "../utilities/logger.js";
import ErrorResponse from "../utilities/errorResponse.js";

export const routeNotFound = (req, res, next) => {
  const error = new ErrorResponse(
    `Not Found - ${req.method} - ${req.originalUrl}`,
    404
  );

  next(error);
};

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  let message = "Internal server error";
  let statusCode = err?.statusCode ?? 500;
  let data = err?.data ?? null;
  if (err instanceof ErrorResponse) message = err.message;

  // mongoose errors if not handling
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (err && err._message?.includes("validation failed")) {
    const errors = new Object();

    Object.values(err.errors).forEach((error) => {
      const fieldName = error.path;
      const errorMessage = error.properties.message;

      if (!errors[fieldName]) {
        errors[fieldName] = new Array();
      }

      errors[fieldName].push(errorMessage);
    });

    statusCode = 400;
    message = err._message;
    data = { errors };
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Resource already exists";
  }

  res.status(statusCode).json({
    status: "error",
    message,
    data,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
