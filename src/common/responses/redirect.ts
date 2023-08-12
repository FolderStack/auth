import { APIGatewayProxyResult } from 'aws-lambda';
import { sanitiseUrl } from '..';

export function Redirect(url: string): APIGatewayProxyResult {
    return {
        statusCode: 302,
        body: '',
        headers: {
            'Access-Control-Allow-Origin': '*',
            Location: sanitiseUrl(url),
        },
    };
}
