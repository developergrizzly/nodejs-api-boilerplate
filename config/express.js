import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import publicRoutes from '../server/routes/public.route';
import privateRoutes from '../server/routes/private.route';
import config from './config';
import APIError from '../server/helpers/APIError';
import expressJwt from 'express-jwt';
import log from '../server/helpers/log4Node';

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes
app.use('/', publicRoutes);
app.use('/api', expressJwt({ secret: config.jwtSecret }));
app.use('/api', privateRoutes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    // ERROR log in terminal
    // console.log({
    //   message: err.isPublic ? err.message : httpStatus[err.status],
    //   stack: config.env === 'development' ? err.stack : {}
    // });
    log.writeFile(err);
    res.status(err.status).json({
      message: err.message.replace(/['"]+/g, '')
    });
  }
);

export default app;
