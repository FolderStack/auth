import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { dynamoDb, logger } from '@common/utils';
import { config } from '@config';

export async function createOAuthConfig(
    orgId: string,
    hostName: string,
    authorizeEndpoint: string,
    tokenExchangeEndpoint: string,
    clientId: string,
    clientSecret: string,
    jwksEndpoint: string
) {
    try {
        const putOperation = new PutItemCommand({
            TableName: config.table,
            Item: marshall({
                PK: `ClientID#${clientId}`,
                SK: `OrgID#${orgId}`,
                authorizeEndpoint,
                tokenEndpoint: tokenExchangeEndpoint,
                clientId,
                clientSecret,
                jwks: jwksEndpoint,
                entityType: 'OAuthConfig',
            }),
        });

        await dynamoDb.send(putOperation);
    } catch (err) {
        logger.warn(err);
        throw new Error('Failed to create OAuth config.');
    }
}
