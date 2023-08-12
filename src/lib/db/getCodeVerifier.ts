import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { dynamoDb, logger } from '@common/utils';
import { config } from '@config';

export async function getCodeVerifier(orgId: string, opId: string) {
    try {
        const getOperation = new GetCommand({
            TableName: config.table,
            Key: {
                PK: `Operation#${opId}`,
                SK: `OrgID#${orgId}`,
            },
        });

        logger.debug('Fetching code verifier...');
        logger.debug(`{ "PK": "Operation#${opId}", "SK": "OrgID#${orgId}" }`);

        const result = await dynamoDb.send(getOperation);
        const item = result?.Item;

        logger.debug('Item:', item);
        if (!item) return null;

        // We don't want the failure of deleting the record to stop the process
        // as it'll still exist anyway if this fails and the process stops.
        try {
            logger.debug('Deleting record...');
            const deleteOperation = new DeleteItemCommand({
                TableName: config.table,
                Key: marshall({
                    PK: `Operation#${opId}`,
                    SK: `OrgID#${orgId}`,
                }),
            });
            await dynamoDb.send(deleteOperation);
        } catch (err: any) {
            logger.debug(
                'Encountered a soft error deleting the record in getCodeVerifier.'
            );
            logger.debug('Error: ' + String(err?.message));
            logger.debug('Stack: ' + String(err?.stack));
        }

        const { exp = null, codeVerifier = null } = item;

        if (!exp || !codeVerifier) return null;
        if (new Date().getTime() >= exp) return null;

        return codeVerifier;
    } catch (err: any) {
        logger.debug('Encountered a error in getCodeVerifier');
        logger.debug('Error: ' + String(err?.message));
        logger.debug('Stack: ' + String(err?.stack));
        return null;
    }
}
