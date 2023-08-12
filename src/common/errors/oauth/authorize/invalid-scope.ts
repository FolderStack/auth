import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class InvalidScopeError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.INVALID_SCOPE, description);
        this.status = 400;
    }
}
