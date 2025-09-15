import ErrorResponse from "../utilities/errorResponse.js";

const validateBody = (schema) => async (req, res, next) => {
  const result = await schema.safeParseAsync(req.body);

  if (!result.success) {
    throw new ErrorResponse(
      "Validation failed",
      400,
      result.error.flatten().fieldErrors
    );
  }

  req.validatedData = result.data;

  return next();
};

export default validateBody;
