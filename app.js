const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const cors = require('cors');
require('./jobs/index');
require('./dev-data/test');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');
const postRoutes = require('./routes/postRoutes');

global.__basedir = `${path.resolve()}/..`;

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(
  cors({
    origin: '*',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Origin',
      'X-Requested-With',
      'Accept'
    ],
    credentials: true
  })
);
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
morgan.token('userId', function(req, res) {
  return req.user ? req.user.id : 'Guest';
});
const morganFormat =
  ':remote-addr - :userId [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';

if (process.env.NODE_ENV === 'production') {
  app.use(morgan(morganFormat));
  const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);
}

// Body parser, reading data from body into req.body
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/list', listRoutes);
app.use('/api/v1/posts', postRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
