export function sanitiseUrl(url: string) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }

    if (url.startsWith('https://localhost')) {
        url = url.replace('https://localhost', 'http://localhost');
    }

    url = url.replace(/(https:\/\/){2,}/g, 'https://');
    return url;
}
