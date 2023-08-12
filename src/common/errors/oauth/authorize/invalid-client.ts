import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class InvalidClientError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.INVALID_CLIENT, description);
        this.status = 401;
    }
}
