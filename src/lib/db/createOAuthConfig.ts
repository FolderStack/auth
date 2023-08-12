import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { dynamoDb, logger } from '@common/utils';
import { config } from '@config';

export async function createOAuthConfig(
    orgId: string,
    endpoint: string,
    clientId: string
) {
    try {
        const putOperation = new PutItemCommand({
            TableName: config.table,
            Item: marshall({
                PK: `OrgID#${orgId}`,
                SK: `OAuthConfig`,
                endpoint,
                clientId,
                entityType: 'OAuthConfig',
            }),
        });

        await dynamoDb.send(putOperation);
    } catch (err) {
        logger.warn(err);
        throw new Error('Failed to create OAuth config.');
    }
}
