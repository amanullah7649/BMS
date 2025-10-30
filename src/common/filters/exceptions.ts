import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

/**
 * Global Exception Filter
 * Catches all unhandled exceptions and formats them consistently
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'Internal Server Error';
        let message = 'An unexpected error occurred';

        // Handle HTTP exceptions
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            error =
                typeof exceptionResponse === 'object' && 'error' in exceptionResponse
                    ? (exceptionResponse as any).error
                    : exception.name;

            message =
                typeof exceptionResponse === 'object' && 'message' in exceptionResponse
                    ? (exceptionResponse as any).message
                    : exception.message;

            const errorResponse = {
                statusCode: status,
                error: error,
                message: Array.isArray(message) ? message : [message],
                timestamp: new Date().toISOString(),
                path: request.url,
            };

            return response.status(status).json(errorResponse);
        }

        // Handle MongoDB duplicate key error (409 Conflict)
        if (exception instanceof Error && (exception as any).code === 11000) {
            status = HttpStatus.CONFLICT;
            error = 'Conflict';
            const field = Object.keys((exception as any).keyPattern || {})[0];
            message = `${field} already exists and must be unique`;
        }

        // Handle other MongoDB errors
        if (exception instanceof MongoError) {
            switch (exception.code) {
                case 11000: // Duplicate key
                    status = HttpStatus.CONFLICT;
                    error = 'Conflict';
                    message = 'A record with this identifier already exists';
                    break;
                default:
                    status = HttpStatus.BAD_REQUEST;
                    error = 'Bad Request';
                    message = 'Database operation failed';
            }
        }

        // Handle validation errors
        if (
            exception instanceof Error &&
            exception.message.includes('validation')
        ) {
            status = HttpStatus.BAD_REQUEST;
            error = 'Bad Request';
            message = exception.message;
        }

        const errorResponse = {
            statusCode: status,
            error: error,
            message: Array.isArray(message) ? message : [message],
            timestamp: new Date().toISOString(),
            path: request.url,
            // Only include stack trace in development
            ...(process.env.NODE_ENV === 'development' && {
                stack: exception instanceof Error ? exception.stack : undefined,
            }),
        };

        response.status(status).json(errorResponse);
    }
}
