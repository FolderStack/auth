import { APIGatewayProxyEvent } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent) {
    // Extract the query parameters
    const message = event?.queryStringParameters?.error ?? 'Unknown';
    const description =
        event?.queryStringParameters?.error_description ??
        'No error information was received.';

    // Construct the HTML response
    const html = `
        <html>
            <head>
                <title>Error</title>
                <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'>
                <style>
                    html {
                        background-color: #2D3142;
                    }

                    body {
                        font-family: "Inter",sans-serif;
                    }

                    section {
                        display: flex;
                        width: 100%;
                        justify-content: center;
                        padding-top: calc(100vh/5);
                    }

                    .container {
                        height: calc(100vh/4);
                        background-color: #E7ECEF;
                        flex: 0.7;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        padding: 12px;
                        border: 1px solid black;
                        border-radius: 5px;
                        text-align: center;
                        justify-content: center;
                    }


                    p {
                        margin-block: 4px;
                    }
                </style>
            </head>
            <body>
                <section>
                    <div class="container">
                        <div>
                            <h2>${message}</h2>
                        </div>
                        <div>
                            <p>${description}</p>
                        </div>
                    </div>
                </section>
            </body>
        </html>
    `;

    // Return the response
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: html,
    };
}
