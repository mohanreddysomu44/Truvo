import Joi from 'joi';

// Validates request body against a Joi schema
// Returns 400 with error details if validation fails
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(d => d.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }
    return next();
  };
};

// ── Validation schemas ──────────────────────────────────

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required()
    .messages({ 'string.min': 'Name must be at least 2 characters' }),

  email: Joi.string().email().required()
    .messages({ 'string.email': 'Please enter a valid email address' }),

  password: Joi.string().min(6).required()
    .messages({ 'string.min': 'Password must be at least 6 characters' }),

  role: Joi.string().valid('admin', 'issuer', 'learner').default('learner'),

  organisation: Joi.string().max(100).allow('').optional(),

  walletAddress: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).allow('').optional()
    .messages({ 'string.pattern.base': 'Invalid wallet address format' }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const issueCertificateSchema = Joi.object({
  learnerName: Joi.string().min(2).max(100).required()
    .messages({ 'string.min': 'Learner name must be at least 2 characters' }),

  learnerEmail: Joi.string().email().required()
    .messages({ 'string.email': 'Please enter a valid learner email' }),

  learnerWallet: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required()
    .messages({ 'string.pattern.base': 'Invalid wallet address — must start with 0x and be 42 characters' }),

  skillName: Joi.string().min(2).max(200).required()
    .messages({ 'string.min': 'Skill name must be at least 2 characters' }),

  issuingOrg: Joi.string().max(100).allow('').optional(),
});