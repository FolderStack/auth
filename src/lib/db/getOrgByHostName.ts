import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { InvalidRequestError } from '@common/errors/oauth';
import { dynamoDb, logger } from '@common/utils';
import { config } from '@config';

export async function getOrgByHostName(hostName: string) {
    try {
        const getOrg = new ScanCommand({
            TableName: config.table,
            ScanFilter: {
                hostname: {
                    AttributeValueList: [{ S: hostName }],
                    ComparisonOperator: 'EQ',
                },
                entityType: {
                    AttributeValueList: [{ S: 'Organisation' }],
                    ComparisonOperator: 'EQ',
                },
            },
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
    throw new InvalidRequestError.UnknownClient(hostName);
}
