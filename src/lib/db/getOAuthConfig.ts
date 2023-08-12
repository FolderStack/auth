import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { TemporarilyUnavailableError } from '@common/errors/oauth';
import { dynamoDb, isValidUrl, logger, sanitiseUrl } from '@common/utils';
import { config } from '@config';

export async function getOauthConfig(orgClientId: string) {
    try {
        const getOperation = new QueryCommand({
            TableName: config.table,
            KeyConditionExpression: 'PK = :clientId',
            FilterExpression: 'entityType = :entityType',
            ExpressionAttributeValues: marshall({
                ':clientId': `ClientID#${orgClientId}`,
                ':entityType': 'OAuthConfig',
            }),
        });

        logger.debug('Searching for OAuthConfig with:', {
            ':clientId': `ClientID#${orgClientId}`,
        });

        const result = await dynamoDb.send(getOperation);
        logger.debug('getOAuthConfig result:', result);
        if (!result.Items?.length) throw new Error();

        const item = unmarshall(result.Items?.[0]);
        const endpoint =
            typeof item?.endpoint === 'string' ? item?.endpoint : null;
        const clientId =
            typeof item?.clientId === 'string' ? item?.clientId : null;
        const clientSecret =
            typeof item?.clientSecret === 'string' ? item?.clientSecret : null;

        if (
            !(
                typeof endpoint === 'string' &&
                endpoint.length &&
                typeof clientId === 'string' &&
                clientId.length &&
                typeof clientSecret === 'string' &&
                clientSecret.length &&
                isValidUrl(sanitiseUrl(String(endpoint)))
            )
        ) {
            throw new TemporarilyUnavailableError('Service not configured.');
        }

        return {
            endpoint: String(endpoint),
            clientId: String(clientId),
            clientSecret: String(clientSecret),
        };
    } catch (err) {
        logger.warn(err);
    }

    throw new TemporarilyUnavailableError('Service not configured.');
}
