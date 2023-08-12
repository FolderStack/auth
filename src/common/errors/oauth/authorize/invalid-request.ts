import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class InvalidRequestError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.INVALID_REQUEST, description);
        this.status = 400;
    }

    static MissingParam = class MissingParamError extends InvalidRequestError {
        constructor(param: string) {
            super(`Missing required parameter: ${param}`);
        }
    };

    static UnknownClient = class UnknownClientError extends InvalidRequestError {
        constructor(client: string) {
            super(`Unknown client: ${client}`);
        }
    };

    static InvalidParam = class InvalidParamError extends InvalidRequestError {
        constructor(param: string, message: string) {
            super(`Invalid parameter '${param}': ${message}`);
        }
    };
}
