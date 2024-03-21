import AppError from "../utils/appError.js";

const handleUserValidationFailed = (err) => {
  console.log(err);
  const message = err.message;
  return new AppError(message, 400);
};
const sendErrorDev = (err, req, res) => {
  console.log("Hello from sendErrorDev");

  // API
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        error: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  console.log("Hello from error middleware");
  //   console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };

    error.message = err.message;
    if (error.name === "ValidationError")
      error = handleUserValidationFailed(error);

    sendErrorProd(error, req, res);
  }
  next();
};

export default globalErrorHandler;
