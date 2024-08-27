const { check, validationResult } = require("express-validator");

const validatePassword = [
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain a special character"),
];

module.exports = validatePassword
