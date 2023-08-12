import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class ServerError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.SERVER_ERROR, description);
        this.status = 500;
    }
}
