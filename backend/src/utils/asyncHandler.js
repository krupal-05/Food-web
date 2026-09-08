const asyncHandler = (responceHandler) => {
  return (req, res, next) => {
    Promise.resolve(responceHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export default asyncHandler ;
