const { rateLimit } = require('express-rate-limit');

const DEFAULT_MAX = 3;
const DEFAULT_WINDOW_MINUTES = 15;

function readPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const max = readPositiveInt(process.env.CONTACT_RATE_LIMIT_MAX, DEFAULT_MAX);
const windowMinutes = readPositiveInt(
  process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES,
  DEFAULT_WINDOW_MINUTES
);
const windowMs = windowMinutes * 60 * 1000;

const contactRateLimit = rateLimit({
  windowMs,
  limit: max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit?.resetTime;
    const retryAfter = resetTime instanceof Date
      ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
      : Math.ceil(windowMs / 1000);
    const minutes = Math.max(1, Math.ceil(retryAfter / 60));

    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({
      error: `Has alcanzado el límite de ${max} mensajes. Intenta de nuevo en ${minutes} ${
        minutes === 1 ? 'minuto' : 'minutos'
      }.`,
      retryAfter,
      limit: max,
    });
  },
});

const contactRateLimitConfig = { max, windowMinutes };

module.exports = { contactRateLimit, contactRateLimitConfig };
