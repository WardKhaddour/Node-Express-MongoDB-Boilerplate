const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const { StatusCodes } = require('http-status-codes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const userRouter = require('./modules/User/router');

const app = express();

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

// Allow cors
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// Set Security HTTP Headers
app.use(helmet());

// Body parser
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Compress text responses
app.use(compression());

// Limit the requests for the same IP
app.use(limiter);

// Serve Static Files
app.use(express.static('public'));

app.use('/api', userRouter);

app.all('*', (req, _, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server`,
      StatusCodes.NOT_FOUND
    )
  );
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
