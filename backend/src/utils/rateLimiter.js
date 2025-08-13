import rateLimit from 'express-rate-limit';


const auth = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many auth requests. Please try again later.'
});

const transactions = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

const analytics = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false
});

const admin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

export const rateLimiter = {
  auth,
  transactions,
  analytics,
  admin,
  global: globalLimiter
};
