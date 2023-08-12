import { OAuthError } from '@common/errors/oauth-error';
import { logger } from '..';
import { Redirect } from './redirect';

export function ErrorRedirect(err: OAuthError, url: string) {
    const { error, description } = err;

    logger.debug(`Redirecting to error (${error}: ${description})`);

    return Redirect(`${url}?error=${error}&error_description=${description}`);
}
