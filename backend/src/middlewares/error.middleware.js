import ErrorResponse from "../utilities/errorResponse.js";

export const routeNotFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);

  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err?.statusCode ?? 500;
  let message = err?.message ?? "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
