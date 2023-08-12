import { InvalidRequestError } from '@common/errors/oauth';
import { UnsupportedGrantTypeError } from '@common/errors/oauth/authorize/unsupported-grant-type';
import { Response } from '@common/responses';
import { isValidUrl } from '@common/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import fetch, { FormData } from 'node-fetch';
import { getOauthConfig } from '../lib/db';
import { withErrorHandler } from '../lib/withErrorHandler';

const ALLOWED_GRANTS = ['authorization_code', 'refresh_token'];

async function token(event: APIGatewayProxyEvent) {
    const params = event.queryStringParameters ?? {};
    const {
        code = '',
        grant_type = '',
        client_id = '',
        refresh_token = '',
        redirect_uri = '',
    } = params;

    if (!client_id) {
        throw new InvalidRequestError.MissingParam('client_id');
    }

    if (!redirect_uri) {
        throw new InvalidRequestError.MissingParam('redirect_uri');
    }

    if (!isValidUrl(redirect_uri)) {
        throw new InvalidRequestError.InvalidParam(
            'redirect_uri',
            'Expected a valid url'
        );
    }

    if (!grant_type) {
        throw new InvalidRequestError.MissingParam('grant_type');
    }

    const grantType = grant_type.trim().toLowerCase();
    if (!ALLOWED_GRANTS.includes(grantType)) {
        throw new UnsupportedGrantTypeError(
            `The grant_type '${grantType}' is not supported.`
        );
    }

    if (grantType === 'authorization_code' && !code) {
        throw new InvalidRequestError.MissingParam('code');
    }

    if (grantType === 'refresh_token' && !refresh_token) {
        throw new InvalidRequestError.MissingParam('refresh_token');
    }

    const { endpoint, clientId, clientSecret } = await getOauthConfig(
        client_id
    );

    const tokenExchBody = new FormData();
    for (const key in params) {
        const value = params[key];
        if (value && value.length) {
            tokenExchBody.set(key, value);
        }
    }
    tokenExchBody.set('client_id', clientId);
    tokenExchBody.set('client_secret', clientSecret);

    try {
        const oauthHost = new URL(endpoint);
        const tokenRes = await fetch(`https://${oauthHost.host}/oauth/token`, {
            method: 'POST',
            body: tokenExchBody,
        });

        const body = (await tokenRes.json()) as any;
        if (typeof body === 'object') {
            return {
                statusCode: tokenRes.status,
                body: JSON.stringify(body),
            };
        } else {
            return Response(tokenRes.status);
        }
    } catch (err) {
        return Response(500);
    }
}

export const handler = withErrorHandler(token, true);
