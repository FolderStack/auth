interface AuthorizeUrlOpts {
    clientId: string;
    redirectUri: string;
    responseType: string;
    state?: string;
}

export function buildAuthorizeUrl(url: string, opts: AuthorizeUrlOpts) {
    const authParams = new URLSearchParams();
    authParams.set('client_id', opts.clientId);
    authParams.set('redirect_uri', opts.redirectUri);
    authParams.set('response_type', opts.responseType);
    if (opts.state) {
        authParams.set('state', opts.state);
    }

    return `${url}?${authParams.toString()}`;
}
