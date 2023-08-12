import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class TemporarilyUnavailableError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.TEMPORARILY_UNAVAILABLE, description);
        this.status = 503;
    }
}
