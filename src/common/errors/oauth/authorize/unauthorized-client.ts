import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class UnauthorizedClientError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.UNAUTHORIZED_CLIENT, description);
        this.status = 400;
    }
}
