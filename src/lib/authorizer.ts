import { InvalidRequestError } from '@common/errors/oauth';

export class Authorizer {
    private clientId?: string;
    private redirectUri?: string;
    private responseType?: string;
    private scope?: string;
    private state?: string;

    public setClientId(s?: string) {
        if (s && s.trim().length > 0) {
            this.clientId = s;
        }
    }

    public getClientId() {
        return this.clientId;
    }

    public setRedirectUri(s?: string) {
        if (s && s.trim().length > 0) {
            this.redirectUri = s;
        }
    }

    public setResponseType(s?: string) {
        if (s && s.trim().length > 0) {
            this.responseType = s;
        }
    }

    public setScope(s?: string) {
        if (s && s.trim().length > 0) {
            this.scope = s;
        }
    }

    public setState(s: string) {
        if (s && s.trim().length > 0) {
            this.state = s;
        }
    }

    public buildState(obj: [string, string][]) {
        this.setState(obj.map((a) => a.join('=')).join('&'));
        this.setState(Buffer.from(this.state!).toString('base64'));
    }

    public buildUrl(baseUrl: string) {
        if (!this.clientId) {
            throw new Error('Client id missing');
        }

        if (!this.redirectUri) {
            throw new Error('redirect uri missing');
        }

        if (!this.responseType) {
            throw new Error('response type missing');
        }

        const authParams = new URLSearchParams();
        authParams.set('client_id', this.clientId);
        authParams.set('redirect_uri', this.redirectUri);
        authParams.set('response_type', this.responseType);
        if (this.scope) {
            authParams.set('scope', this.scope);
        }
        if (this.state) {
            authParams.set('state', this.state);
        }

        return `${baseUrl}?${authParams.toString()}`;
    }

    public validate() {
        if (!this.clientId) {
            throw new InvalidRequestError.MissingParam('client_id');
        }

        if (!this.redirectUri) {
            throw new InvalidRequestError.MissingParam('redirect_uri');
        }

        if (!this.responseType) {
            throw new InvalidRequestError.MissingParam('response_type');
        }

        return this.clientId;
    }
}
