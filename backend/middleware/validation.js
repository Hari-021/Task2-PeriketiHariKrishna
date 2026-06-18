const { check, validationResult } = require('express-validator');

const checkErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  checkErrors
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty(),
  checkErrors
];

const subscriptionValidation = [
  check('serviceName', 'Service Name is required').notEmpty().trim(),
  check('category', 'Category is required').notEmpty().trim(),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
  check('billingCycle', 'Billing cycle must be weekly, monthly, quarterly, or yearly')
    .isIn(['weekly', 'monthly', 'quarterly', 'yearly']),
  check('renewalDate', 'Renewal date must be a valid ISO8601 date string').isISO8601(),
  check('status', 'Status must be active, paused, expired, or archived')
    .optional()
    .isIn(['active', 'paused', 'expired', 'archived']),
  check('autoRenew', 'Auto renew must be a boolean').optional().isBoolean(),
  checkErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  subscriptionValidation
};
