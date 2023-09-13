import { InvalidRequestError } from '@common/errors/oauth';
import { UnsupportedGrantTypeError } from '@common/errors/oauth/authorize/unsupported-grant-type';
import { Response } from '@common/responses';
import { isValidUrl, logger } from '@common/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import fetch from 'node-fetch';
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

    logger.debug('token', { params });

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

    const { tokenExchange, clientId, clientSecret } = await getOauthConfig(
        client_id
    );

    logger.debug('params', { params });

    const postBody: Record<string, string> = {};

    postBody.client_id = clientId;
    postBody.client_secret = clientSecret;
    postBody.grant_type = grantType;
    postBody.redirect_uri = redirect_uri;

    if (params.code) {
        postBody.code = params.code;
    }

    if (params.refresh_token) {
        postBody.refresh_token = refresh_token;
    }

    try {
        logger.debug('token', {
            tokenExchange,
            postBody,
        });

        const tokenRes = await fetch(tokenExchange, {
            method: 'POST',
            body: JSON.stringify(postBody),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const body = (await tokenRes.json()) as any;
        logger.debug('token', { responseBody: body, tokenRes });
        if (typeof body === 'object') {
            return {
                statusCode: tokenRes.status,
                body: JSON.stringify(body),
            };
        } else {
            return Response(tokenRes.status);
        }
    } catch (err) {
        console.log(err);
        logger.warn({ err });
        return Response(500);
    }
}

export const handler = withErrorHandler(token, true);
