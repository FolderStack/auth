import { InvalidRequestError } from '@common/errors/oauth';

export class AuthorizeValidator {
    constructor(
        private readonly clientId?: unknown,
        private readonly redirectUri?: unknown,
        private readonly responseType?: unknown
    ) {
        //
    }

    public async validate() {
        if (!this.clientId || typeof this.clientId !== 'string') {
            throw new InvalidRequestError.MissingParam('client_id');
        }

        if (!this.redirectUri) {
            throw new InvalidRequestError.MissingParam('redirect_uri');
        }

        if (!this.responseType) {
            throw new InvalidRequestError.MissingParam('response_type');
        }

        return Promise.resolve(String(this.clientId));
    }
}
