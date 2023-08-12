import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class UnsupportedGrantTypeError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.UNSUPPORTED_GRANT_TYPE, description);
        this.status = 400;
    }
}
