import rateLimit from 'express-rate-limit';

// Strict rate limiter for authentication endpoints (prevent brute force)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login/register attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
  skip: () => process.env.NODE_ENV === 'test', // Skip in automated tests
});

// General rate limiter for standard API
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please slow down',
  },
  skip: () => process.env.NODE_ENV === 'test',
});
