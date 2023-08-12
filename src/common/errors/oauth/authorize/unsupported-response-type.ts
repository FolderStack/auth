import { AuthorizeError } from '@common/errors/authorize-error';
import { AuthorizeErrorType } from './error-types';

export class UnsupportedResponseTypeError extends AuthorizeError {
    constructor(description: string) {
        super(AuthorizeErrorType.UNSUPPORTED_RESPONSE_TYPE, description);
        this.status = 400;
    }
}
