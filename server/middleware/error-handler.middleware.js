export const handleAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const errorHandler = (err, req, res, next) => {
  let { statusCode, status, message } = err;
  if (!statusCode) statusCode = 500;
  if (!status) status = "error";
  res.status(statusCode).json({
    status,
    message,
  });
};
