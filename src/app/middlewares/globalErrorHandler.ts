import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import config from '../config';
import handleValidationError from '../errors/handleValidationError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import handleCastError from '../errors/handleCastError';
import httpStatus from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (
  err, 
  req, 
  res , 
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } 
  
  else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } 
  
  else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } 
  
  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    message = simplifiedError?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } 
  
  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } 
  
  else if (err instanceof Error) {
    statusCode = httpStatus.NOT_FOUND;
    message =  "No Data Found";
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
   
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources,
    err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
