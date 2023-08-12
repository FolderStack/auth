import { APIGatewayProxyResult } from 'aws-lambda';

export function Response(status: number): APIGatewayProxyResult {
    return {
        statusCode: status,
        body: '',
    };
}
