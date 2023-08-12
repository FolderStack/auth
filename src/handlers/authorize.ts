import { UnauthorizedClientError } from '@common/errors/oauth';
import { Redirect } from '@common/responses';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { SafeUrl } from '../lib';
import { AuthorizeValidator } from '../lib/authorize-validator';
import { Authorizer } from '../lib/authorizer';
import { getOauthConfig } from '../lib/db';
import { withErrorHandler } from '../lib/withErrorHandler';

const ALLOWED_GRANTS = ['code'];

async function authorizeHandler(event: APIGatewayProxyEvent) {
    const safeHost = SafeUrl();

    const params = event.queryStringParameters ?? {};
    const {
        client_id = '',
        redirect_uri = '',
        response_type = '',
        state = '',
        scope = '',
    } = params;

    const validator = new AuthorizeValidator(
        client_id,
        redirect_uri,
        response_type
    );
    const hostName = await validator.validate();

    const responseType = response_type.trim().toLowerCase();
    if (!ALLOWED_GRANTS.includes(responseType)) {
        throw new UnauthorizedClientError(
            `The response_type '${responseType}' is not authorized for this client.`
        );
    }

    // We're overwriting the safeHost so that any further errors that occur
    // after this point will redirect the errors back to the org error page
    // rather than the generic error page.
    safeHost.setUrl(hostName);

    const { endpoint, clientId } = await getOauthConfig(hostName);

    const authorizer = new Authorizer();
    authorizer.setClientId(clientId);
    authorizer.setRedirectUri(redirect_uri);
    authorizer.setResponseType('code');
    authorizer.setState(state);
    authorizer.setScope(scope);

    const authUrl = authorizer.buildUrl(endpoint);

    return Redirect(authUrl);
}

export const handler = withErrorHandler(authorizeHandler);
