import { ErrorRedirect } from '../responses/error-redirect';
import { logger as Logger } from '../utils/logger';

export class OAuthError extends Error {
    protected status = 400;
    protected readonly logger = Logger;

    constructor(
        public readonly error: string,
        public readonly description: string
    ) {
        super(error);
        this.log();
    }

    protected log() {
        this.logger.debug(this.constructor.name, this.error, this.description);
    }

    toResponse(url: string | CallableFunction, shouldReturn = false) {
        if (shouldReturn) {
            return {
                statusCode: this.status,
                body: JSON.stringify({
                    error: this.error,
                    error_description: this.description,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
            };
        }
        if (typeof url === 'string') {
            return ErrorRedirect(this, url);
        } else if (typeof url === 'function') {
            return ErrorRedirect(this, url());
        }
    }
}
