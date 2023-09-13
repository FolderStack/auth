import { ServerError } from '@common/errors/oauth';
import { OAuthError } from '@common/errors/oauth-error';
import { logger } from '@common/utils';
import { SafeUrl } from './safeUrl';

export function withErrorHandler(fn: CallableFunction, shouldReturn = false) {
    const safeHost = SafeUrl();
    return async function (...args: any[]) {
        try {
            const result = await fn(...args);
            return result;
        } catch (err: any) {
            logger.warn('error', { err });
            if (err instanceof OAuthError) {
                return err.toResponse(safeHost.getErrorUrl, shouldReturn);
            }

            logger.warn(`Encountered an error (${String(err?.message)})`);
            logger.warn('Stack:\n' + err?.stack);

            return new ServerError('Internal server error').toResponse(
                safeHost.getErrorUrl,
                shouldReturn
            );
        }
    };
}
