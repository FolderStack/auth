import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { dynamoDb, logger, secureHash } from '@common/utils';
import { config } from '@config';
import { randomBytes } from 'crypto';

export async function createChallengePair(orgId: string, opId: string) {
    try {
        const codeVerifier = randomBytes(16)
            .toString('base64')
            .replace(/\=/gi, '')
            .trim();

        const codeChallenge = secureHash(codeVerifier);

        const putOperation = new PutItemCommand({
            TableName: config.table,
            Item: marshall({
                PK: `Operation#${opId}`,
                SK: `OrgID#${orgId}`,
                codeVerifier,
                exp: Number(new Date().getTime() + 1000 * 60 * 5), // 5 minutes
                entityType: 'OAuthCodePair',
            }),
        });

        await dynamoDb.send(putOperation);

        return codeChallenge;
    } catch (err) {
        logger.warn(err);
        throw new Error('Failed to create code challenge pair.');
    }
}
