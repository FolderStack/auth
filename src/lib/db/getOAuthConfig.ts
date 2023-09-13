import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { TemporarilyUnavailableError } from '@common/errors/oauth';
import { dynamoDb, isValidUrl, logger, sanitiseUrl } from '@common/utils';
import { config } from '@config';

export async function getOauthConfig(orgHostName: string) {
    try {
        const scanOperation = new ScanCommand({
            TableName: config.table,
            ScanFilter: {
                hostName: {
                    AttributeValueList: [
                        {
                            S: orgHostName,
                        },
                    ],
                    ComparisonOperator: 'EQ',
                },
                entityType: {
                    AttributeValueList: [
                        {
                            S: 'OAuthConfig',
                        },
                    ],
                    ComparisonOperator: 'EQ',
                },
            },
        });

        const result = await dynamoDb.send(scanOperation);
        logger.debug('getOAuthConfig result', { result });
        if (!result.Items?.length) throw new Error();

        const item = unmarshall(result.Items?.[0]);
        const authorizeEndpoint =
            typeof item?.authorizeEndpoint === 'string'
                ? item?.authorizeEndpoint
                : null;
        const clientId =
            typeof item?.PK === 'string' ? item?.PK?.split('#')?.[1] : null;
        const clientSecret =
            typeof item?.clientSecret === 'string' ? item?.clientSecret : null;
        const tokenEndpoint =
            typeof item?.tokenEndpoint === 'string' ? item.tokenEndpoint : null;

        logger.debug('oauth config', {
            item,
            authorizeEndpoint,
            clientId,
            clientSecret,
            tokenEndpoint,
        });

        if (
            !(
                typeof authorizeEndpoint === 'string' &&
                authorizeEndpoint.length &&
                typeof clientId === 'string' &&
                clientId.length &&
                typeof clientSecret === 'string' &&
                clientSecret.length &&
                isValidUrl(sanitiseUrl(String(authorizeEndpoint))) &&
                typeof tokenEndpoint === 'string' &&
                isValidUrl(sanitiseUrl(String(tokenEndpoint)))
            )
        ) {
            throw new TemporarilyUnavailableError('Service not configured.');
        }

        return {
            clientId: String(clientId),
            clientSecret: String(clientSecret),
            authorizeEndpoint: String(authorizeEndpoint),
            tokenExchange: String(tokenEndpoint),
        };
    } catch (err) {
        logger.warn(err);
    }

    throw new TemporarilyUnavailableError('Service not configured.');
}
