import { isValidUrl, logger, sanitiseUrl } from '@common/utils';

let safeUrl = 'auth.folderstack.io';

export function SafeUrl() {
    return {
        setUrl(url: string) {
            if (isValidUrl(url)) {
                safeUrl = url;
            }
        },
        getUrl() {
            return safeUrl;
        },
        getErrorUrl() {
            logger.debug(
                `Getting error url: '${sanitiseUrl(safeUrl + '/auth/error')}'`
            );
            return new URL(sanitiseUrl(safeUrl + '/auth/error')).toString();
        },
    };
}
