import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class AccessDeniedError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.ACCESS_DENIED, description);
        this.status = 403;
    }
}
