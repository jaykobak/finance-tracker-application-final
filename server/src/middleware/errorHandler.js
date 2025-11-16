export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // PostgreSQL specific errors
  if (err.code === "23505") {
    // Unique constraint violation
    statusCode = 409;
    message = "A record with this information already exists";
  } else if (err.code === "23503") {
    // Foreign key violation
    statusCode = 400;
    message = "Invalid reference to related data";
  } else if (err.code === "22P02") {
    // Invalid input syntax
    statusCode = 400;
    message = "Invalid data format";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
