import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoDb = new DynamoDBClient({
    region: process.env.REGION,
});
