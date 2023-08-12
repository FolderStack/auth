import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { InvalidRequestError } from '@common/errors/oauth';
import { dynamoDb, logger } from '@common/utils';
import { config } from '@config';

export async function getOrgById(id?: unknown) {
    if (typeof id === 'string' && id.length > 0) {
        try {
            const getOrg = new QueryCommand({
                TableName: config.table,
                KeyConditionExpression: 'PK = :PK',
                FilterExpression: 'entityType = :entityType',
                ExpressionAttributeValues: marshall({
                    ':PK': `OrgID#${id}`,
                    ':entityType': 'Organisation',
                }),
            });

            const result = await dynamoDb.send(getOrg);
            const items = result?.Items?.map((item) => unmarshall(item));

            const org = items?.[0];
            if (org && typeof org === 'object' && 'PK' in org) {
                return {
                    id: org.PK.split('#')[1],
                    name: org.SK.split('#')[1],
                    hostname: org.hostname,
                };
            }
        } catch (err) {
            logger.warn(err);
        }
        throw new InvalidRequestError.UnknownClient(id);
    }
    throw new InvalidRequestError.UnknownClient('Nil');
}
