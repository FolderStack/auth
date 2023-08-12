import { APIGatewayProxyResult } from 'aws-lambda';

export function Ok(body: any): APIGatewayProxyResult {
    return {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    };
}
